/* #region  Imports */
"use strict";
import * as vscode from "vscode";
/* #endregion */

class DocumentRecord {
    public interval: NodeJS.Timer | null = null;
    public document: vscode.TextDocument;
    public languageId: string;
    public trackStartTime: Date = new Date();

    /**
     *
     */
    constructor(document: vscode.TextDocument, languageId: string) {
        this.document = document;
        this.languageId = languageId;

    }
}

class EventHandler<T extends (...args: any[]) => void>{
    private subscriptions: T[] = [];

    public add(t: T) {
        this.subscriptions.push(t);
    }

    public invoke(...args: any[]) {
        for (var sub of this.subscriptions) {
            sub(args);
        }
    }

    public remove(t: T) {
        var idx = -1;
        for (var i = 0; i < this.subscriptions.length; i++) {
            var sub = this.subscriptions[i];
            if (sub === t) {
                idx = i;
                break;
            }
        }
        if (idx === -1) { return; }

        this.subscriptions.splice(idx, 1);
    }

}

export class FileMonitorSettings {
    stopTrackingAfterChange: boolean = true;
    stopTrackingAfterMs: number | null = 2000;
}

export class FileMonitor {

    onLanguageIdChanged: EventHandler<((document: vscode.TextDocument, oldLanguageId: string, newLanguageId: string) => void)>;

    private _documentDictionary: DocumentRecord[] = [];
    _settings: FileMonitorSettings;

    constructor(settings: FileMonitorSettings | null = null) {
        //context: vscode.ExtensionContext, 
        var defaultFileMonitorSettings = new FileMonitorSettings();
        this._settings = defaultFileMonitorSettings;

        this.onLanguageIdChanged = new EventHandler<((document: vscode.TextDocument, oldLanguageId: string, newLanguageId: string) => void)>();

        vscode.workspace.onDidOpenTextDocument(
            this.onFileOpen,
            null
        );

        vscode.workspace.onDidCloseTextDocument(
            this.onFileClose,
            null
        );
    }

    private findDocumentRecord(document: vscode.TextDocument) {
        let selectedIndex = -1;
        for (let i = 0; i < this._documentDictionary.length; i++) {
            let docRecordI = this._documentDictionary[i];
            if (docRecordI.document === document) {
                selectedIndex = i;
                break;
            }
        }
        if (selectedIndex === -1) { return { record: null, index: selectedIndex }; }

        const docRecord = this._documentDictionary[selectedIndex];
        return { record: docRecord, index: selectedIndex };
    }

    private stopTrackingDocument(document: vscode.TextDocument) {
        const ret = this.findDocumentRecord(document);
        if (!ret.record) { return; }

        this._documentDictionary.splice(ret.index, 1);

        const docRecord = ret.record;
        if (docRecord.interval) { clearInterval(docRecord.interval); }
        docRecord.interval = null;
    }

    public onFileClose(document: vscode.TextDocument) {
        this.stopTrackingDocument(document);
    }

    public onFileOpen(document: vscode.TextDocument) {
        debugger;
        this.onLanguageIdChanged.invoke(document, null, document.languageId);
        var documentRecord = new DocumentRecord(document, document.languageId);

        documentRecord.trackStartTime = new Date();
        documentRecord.interval = setTimeout(() => {
            const ret = this.findDocumentRecord(document);
            if (!ret.record) { return; }
            if (ret.record.languageId !== document.languageId) {
                //The LanguageID has changed.
                this.raiseLanguageIdChanged(ret.record.document, ret.record.languageId, document.languageId);
                ret.record.languageId = document.languageId;

                if (this._settings.stopTrackingAfterChange) {
                    this.stopTrackingDocument(document);
                }
            }

            var now = new Date().getTime();
            var elapsedTimeMs = now - ret.record.trackStartTime.getTime();
            if (this._settings.stopTrackingAfterMs) {
                if (elapsedTimeMs >= this._settings.stopTrackingAfterMs) {
                    this.stopTrackingDocument(document);
                }
            }
        }, 10);
        this._documentDictionary.push(documentRecord);

    }
    private raiseLanguageIdChanged(document: vscode.TextDocument, oldLanguageId: string, newLanguageId: string) {
        this.onLanguageIdChanged.invoke(document, oldLanguageId, newLanguageId);

    }
}