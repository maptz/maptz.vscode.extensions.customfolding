/* #region  Imports */
"use strict";
import * as vscode from "vscode";
/* #endregion */

/* #region  DocumentRecord */
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
/* #endregion */

/* #region  EventHandler */
class EventHandler<T extends (...args: any[]) => void>{
    private subscriptions: T[] = [];

    public add(t: T) {
        this.subscriptions.push(t);
    }

    public invoke(...args: any[]) {
        var ams = <any[]>[].slice.call(arguments);
        ams.unshift({});
        for (var sub of this.subscriptions) {
            sub.apply({}, args);
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
/* #endregion */

/* #region FileMonitorSettings  */
export class FileMonitorSettings {
    stopTrackingAfterChange: boolean = true;
    stopTrackingAfterMs: number | null = 2000;
    trackLanguageIdChanges: boolean = true;
}
/* #endregion */

/* #region  FileMonitor */
export class FileMonitor {

    public onLanguageIdChanged: EventHandler<((document: vscode.TextDocument, oldLanguageId: string, newLanguageId: string) => void)>;
    public onFileOpened: EventHandler<((document: vscode.TextDocument) => void)>;
    public onFileClosing: EventHandler<((document: vscode.TextDocument) => void)>;

    private _documentDictionary: DocumentRecord[] = [];
    _settings: FileMonitorSettings;

    // private getTextEditor(document: vscode.TextDocument) : vscode.TextEditor | null{
    //     for(let te of vscode.window.visibleTextEditors){
    //         if (te.document.fileName === document.fileName){
    //             return te;
    //         }
    //     }
    //     return null;
    // }

    public manuallyRegisterDocument(doc: vscode.TextDocument){
        this.fileOpening(doc);
    }

    constructor(settings: FileMonitorSettings | null = null) {
        //context: vscode.ExtensionContext, 
        var defaultFileMonitorSettings = new FileMonitorSettings();
        this._settings = defaultFileMonitorSettings;

        this.onLanguageIdChanged = new EventHandler<((document: vscode.TextDocument, oldLanguageId: string, newLanguageId: string) => void)>();
        this.onFileOpened = new EventHandler<((document: vscode.TextDocument) => void)>();
        this.onFileClosing = new EventHandler<((document: vscode.TextDocument) => void)>();

        // vscode.workspace.onDidChangeTextDocument((doc)=>{
        //     var textEditor = this.getTextEditor(doc.document);
        //     console.log("Document: " + textEditor?.document.fileName + " TextEditor: " + textEditor);

        // }, null);
        vscode.workspace.onDidOpenTextDocument(
            (dpc) => { this.fileOpening(dpc); },
            null
        );

        vscode.workspace.onDidCloseTextDocument(
            (dpc) => { this.fileClosing(dpc); },
            this
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
        console.log("Stop tracking doc " + document.fileName);
        const ret = this.findDocumentRecord(document);
        if (!ret.record) { return; }

        this._documentDictionary.splice(ret.index, 1);

        const docRecord = ret.record;
        if (docRecord.interval) { clearInterval(docRecord.interval); }
        docRecord.interval = null;
    }

    protected fileClosing(document: vscode.TextDocument) {
        this.onFileClosing.invoke(document);
        this.stopTrackingDocument(document);
    }

    protected fileOpening(document: vscode.TextDocument) {
        this.onFileOpened.invoke(document);
        this.onLanguageIdChanged.invoke(document, null, document.languageId);
        if (!this._settings.trackLanguageIdChanges) { return; }

        var documentRecord = new DocumentRecord(document, document.languageId);
        documentRecord.trackStartTime = new Date();
        this._documentDictionary.push(documentRecord);

        documentRecord.interval = setTimeout(() => {
            //console.log("DocumentRecord Interval running for doc " + document.fileName);
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


    }
    private raiseLanguageIdChanged(document: vscode.TextDocument, oldLanguageId: string, newLanguageId: string) {
        this.onLanguageIdChanged.invoke(document, oldLanguageId, newLanguageId);

    }
}
/* #endregion */