/* #region  Imports */
"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as Maptz from "./MyFoldingRangeProvider";
import * as config from "./../config/Configuration";
import { FileMonitor } from "./FileMonitor";
import { RegionService } from "./RegionServices";
import { RegionWrapperService } from "./RegionWrapper";
/* #endregion */

/* #region  Engine */
export class Engine {
    private _foldingRangeProvider: Maptz.MyFoldingRangeProvider | null = null;
    private _configService: config.ConfigurationService;
    private _fileMonitor: FileMonitor;

    public get FoldingRangeProvider() {
        return this._foldingRangeProvider;
    }

    public dispose() {
        this._foldingRangeProvider = null;
    }

    public selectCurrentRegion() {

        var ate = vscode.window.activeTextEditor;
        if (!ate) { return; }
        let document = ate.document;
        if (!document) { return; }

        var rs = new RegionService(this._configService, document);
        var currentRegion = rs.currentRegion();
        if (!currentRegion) { return; }

        var srt = currentRegion.startRegionTag;
        var start1 = new vscode.Position(srt.lineNumber, <number>srt.startCharacter);
        var startLine = ate.document.lineAt(srt.lineNumber);
        var end1 = new vscode.Position(srt.lineNumber, startLine.text.length);

        var ert = currentRegion.endRegionTag;
        var endLine = ate.document.lineAt(ert.lineNumber);
        if (!endLine) { return; }
        var start2 = new vscode.Position(ert.lineNumber, <number>ert.startCharacter);
        var end2 = new vscode.Position(ert.lineNumber, endLine.text.length);

        ate.selection = new vscode.Selection(start1, end2);
    }

    public selectCurrentRegionContents() {

        var ate = vscode.window.activeTextEditor;
        if (!ate) { return; }
        let document = ate.document;
        if (!document) { return; }

        var rs = new RegionService(this._configService, document);
        var currentRegion = rs.currentRegion();
        if (!currentRegion) { return; }

        var srt = currentRegion.startRegionTag;
        var startLineNumber = srt.lineNumber + 1;
        var endLineNumber = currentRegion.endRegionTag.lineNumber - 1;
        if (endLineNumber < startLineNumber) { return; }

        var startLine = ate.document.lineAt(startLineNumber);
        var endLine = ate.document.lineAt(endLineNumber);

        var start1 = startLine.range.start;
        var end1 = endLine.range.end;

        ate.selection = new vscode.Selection(start1, end1);
    }

    public removeCurrentRegionTags() {
        vscode.window.showInformationMessage("Remove current region tags");
        var ate = vscode.window.activeTextEditor;
        if (!ate) { return; }
        let document = ate.document;
        if (!document) { return; }

        var rs = new RegionService(this._configService, document);
        var currentRegion = rs.currentRegion();
        if (!currentRegion) { return; }

        ate.edit(edit => {
            if (!currentRegion) { return; }
            if (!ate) { return; }
            var srt = currentRegion.startRegionTag;
            var start1 = new vscode.Position(srt.lineNumber, <number>srt.startCharacter);
            var startLine = ate.document.lineAt(srt.lineNumber);
            var end1 = new vscode.Position(srt.lineNumber, startLine.text.length);
            var range = new vscode.Range(start1, end1);
            edit.delete(range);

            var ert = currentRegion.endRegionTag;
            var endLine = ate.document.lineAt(ert.lineNumber);
            if (!endLine) { return; }


            var start2 = new vscode.Position(ert.lineNumber, <number>ert.startCharacter)
            var end2 = new vscode.Position(ert.lineNumber, endLine.text.length);
            range = new vscode.Range(start2, end2);
            edit.delete(range);
            // tslint:disable-next-line:no-unused-expression
        });
    }


    public deleteCurrentRegion() {
        vscode.window.showInformationMessage("Delete current region tags");
        var ate = vscode.window.activeTextEditor;
        if (!ate) { return; }
        let document = ate.document;
        if (!document) { return; }

        var rs = new RegionService(this._configService, document);
        var currentRegion = rs.currentRegion();
        if (!currentRegion) { return; }

        ate.edit(edit => {
            if (!currentRegion) { return; }
            if (!ate) { return; }
            var srt = currentRegion.startRegionTag;
            var start = new vscode.Position(srt.lineNumber, <number>srt.startCharacter);
            var ert = currentRegion.endRegionTag;

            var endLine = ate.document.lineAt(ert.lineNumber);
            if (!endLine) { return; }
            var endLineT = endLine.text;

            var end = new vscode.Position(ert.lineNumber, endLineT.length);

            var range = new vscode.Range(start, end);

            edit.delete(range);
            // tslint:disable-next-line:no-unused-expression
        });
    }


    public collapseAllRegions(document: vscode.TextDocument | null = null, onlyDefaults: boolean = false) {
        // vscode.window.showInformationMessage("collapse all regions");
        if (!document) {
            var ate = vscode.window.activeTextEditor;
            if (!ate) { return; }
            document = ate.document;
            if (!document) { return; }
        }

        console.log("Collapsing all regions");

        /* #region  NEW CODE */
        const rs = new RegionService(this._configService, document);
        const regions = rs.getRegions();
        const arr = [];
        for (let region of regions) {
            if (onlyDefaults && !region.isDefaultRegion) {
                continue;
            }
            arr.push(region.lineStart);
        }
        /* #endregion */

        /* #region  OLD CODE */

        // let currentLanguageConfig = this._configService.getConfigurationForCurrentLanguage(document.languageId);
        // if (!currentLanguageConfig) { return; }
        // if (!currentLanguageConfig.foldStartRegex) { return; }

        // var arr = [];
        // for (let i = 0; i < document.lineCount; i++) {
        //     var line = document.lineAt(i);

        //     var start = new RegExp(currentLanguageConfig.foldStartRegex, "i");
        //     if (start.exec(line.text.toString())) {
        //         arr.push(i);
        //     }
        // }
        /* #endregion */
        this.foldLines(document, arr);
    }


    public collapseAllDefaultFolds(document: vscode.TextDocument | null = null) {
        this.collapseAllRegions(document, true);
    }

    private getTextEditor(document: vscode.TextDocument): vscode.TextEditor | null {

        for (let te of vscode.window.visibleTextEditors) {
            if (te.document.fileName === document.fileName) {
                return te;
            }
        }
        return null;
    }

    private async foldLines(document: vscode.TextDocument, foldLines: Array<number>) {
        var str = "";
        foldLines.forEach(p => str += p + ",");
        console.log("folding lines: " + str);

        const textEditor = this.getTextEditor(document);
        if (!textEditor) { return; }
        const selection = textEditor.selection;

        for (const lineNumber of foldLines) {
            textEditor.selection = new vscode.Selection(lineNumber, 0, lineNumber, 0);
            await vscode.commands.executeCommand('editor.fold');
            console.log('folding ' + textEditor.selection.anchor.line);
        }
        textEditor.selection = selection;
        // textEditor.revealRange(textEditor.selection, vscode.TextEditorRevealType.InCenter);
    }


    public wrapWithRegionAndComment() {

        vscode.commands.executeCommand(
            "editor.action.commentLine",
            "editorHasDocumentFormattingProvider && editorTextFocus",
            true
        ).then(() => {

            const textEditor = vscode.window.activeTextEditor;
            if (!textEditor) { return; }
            const selection = textEditor.selection;

            var newStart = new vscode.Position(selection.start.line, 0);
            var newEnd = textEditor.document.lineAt(selection.end.line).range.end;

            textEditor.selection = new vscode.Selection(newStart, newEnd);

            vscode.commands.executeCommand(
                "regionfolder.wrapWithRegion",
                "editorHasDocumentFormattingProvider && editorTextFocus",
                true
            );
        });


    }

    public wrapWithRegion() {
        var regionWrapper = new RegionWrapperService(this._configService);
        regionWrapper.wrapCurrentWithRegion();
    }


    private registerFoldingRangeProvider() {
        const supportedLanguages = this._configService.getSupportedLanguages();
        const foldingRangeProvider = new Maptz.MyFoldingRangeProvider(this._configService);
        vscode.languages.registerFoldingRangeProvider(
            supportedLanguages,
            foldingRangeProvider
        );

        this._configService.onConfigurationChanged = () => {
            foldingRangeProvider.configurationService = this._configService;
        };


        return foldingRangeProvider;
    }

    /**
     *
     */
    constructor(configService: config.ConfigurationService) {
        var self = this;
        this._configService = configService;
        this._foldingRangeProvider = this.registerFoldingRangeProvider();

        this._fileMonitor = new FileMonitor();
        this._fileMonitor.onFileOpened.add(function (doc) {
            console.log("File opened: " + doc.fileName + " lid: " + doc.languageId);
            if (doc.languageId) {
                //HMM HACK! No texteditor defined for document when this event has been called. 
                var collapseOnlyDefaults = true;
                setTimeout(() => { self.collapseAllRegions(doc, collapseOnlyDefaults); }, 10);

            }
        });
        this._fileMonitor.onFileClosing.add(function (doc) {
            console.log("File closing: " + doc.fileName);
        });
        this._fileMonitor.onLanguageIdChanged.add(function (doc, oldLID, newLID) {
            // vscode.window.showTextDocument(doc, 1, false).then(e => {
            //     e.edit(edit => {
            //         edit.insert(new vscode.Position(0, 0), "Your advertisement here");
            //     });
            console.log("FileMonitor has detected change in language: " + newLID);

            if (newLID) {
                self.collapseAllRegions(doc);
            }
        });


        for (let vte of vscode.window.visibleTextEditors) {
            this._fileMonitor.manuallyRegisterDocument(vte.document);
        }


    }

}
/* #endregion */