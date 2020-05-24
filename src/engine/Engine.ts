/* #region  Imports */
"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as Maptz from "./MyFoldingRangeProvider";
import * as config from "./../config/Configuration";
import { FileMonitor } from "./FileMonitor";
//import * as regs from "./CustomRegions";
//import {RegionWrapperService} from "./RegionWrapper";
/* #endregion */


/* #region  Engine */
export class Engine {
    private _foldingRangeProvider: Maptz.MyFoldingRangeProvider | null = null;
    private _configService: config.ConfigurationService ;
    private _fileMonitor: FileMonitor;


    public dispose(){
    this._foldingRangeProvider = null;
}
    
/* 
    public deleteCurrentRegion() {
        vscode.window.showInformationMessage("Delete current region tags");

        let document = vscode.window.activeTextEditor?.document;
        if (!document) { return; }
        var rs = new regs.RegionService(this._configService, document);
        var currentRegion = rs.currentRegion();
        if (!currentRegion) { return; }

        vscode.window.activeTextEditor?.edit(edit => {
            if (!currentRegion) { return; }
            var srt = currentRegion.startRegionTag;
            var start = new vscode.Position(srt.lineNumber, <number>srt.startCharacter);
            var ert = currentRegion.endRegionTag;
            var end = new vscode.Position(ert.lineNumber, <number>ert.startCharacter);
            var range = new vscode.Range(start, end);

            edit.delete(range);
        // tslint:disable-next-line:no-unused-expression
        });
    }

    public commentCurrentRegion() {
        vscode.window.showInformationMessage("Comment current region tags");
        let ate = vscode.window.activeTextEditor;
        if (!ate) { return; }
        let document = ate.document;
        if (!document) { return; }
        var rs = new regs.RegionService(this._configService, document);
        var currentRegion = rs.currentRegion();
        if (!currentRegion) { return; }

        var oldSelection = ate.selection;

        var srt = currentRegion.startRegionTag;
        var start = new vscode.Position(srt.lineNumber, <number>srt.startCharacter);
        var ert = currentRegion.endRegionTag;
        var end = new vscode.Position(ert.lineNumber, <number>ert.startCharacter);
        
        ate.selection = new vscode.Selection(start, end);

        vscode.commands.executeCommand(
            "editor.action.commentLine",
            "editorHasDocumentFormattingProvider && editorTextFocus",
            true
        );

        ate.selection = oldSelection;
    }

    public collapseAllRegions() {
        vscode.window.showInformationMessage("collapse all regions");
        let currentLanguageConfig = this._configService.getConfigurationForCurrentLanguage();
        if (!currentLanguageConfig) { return; }
        if (!currentLanguageConfig.foldStartRegex) { return; }

        var ate = vscode.window.activeTextEditor;
        if (!ate) { return; }


        var arr = [];
        for (let i = 0; i < ate.document.lineCount; i++) {
            var line = ate.document.lineAt(i);

            var start = new RegExp(currentLanguageConfig.foldStartRegex, "i");
            if (start.exec(line.text.toString())) {
                arr.push(i);
            }
        }
        this.foldLines(arr);
    }

    public doDefaultFold() {
        vscode.window.showInformationMessage("do-default-fold");
        let currentLanguageConfig = this._configService.getConfigurationForCurrentLanguage();
        if (!currentLanguageConfig) { return; }
        if (!currentLanguageConfig.defaultFoldStartRegex) { return; }

        var ate = vscode.window.activeTextEditor;
        if (!ate) { return; }


        var arr = [];
        for (let i = 0; i < ate.document.lineCount; i++) {
            var line = ate.document.lineAt(i);

            var start = new RegExp(currentLanguageConfig.defaultFoldStartRegex, "i");
            if (start.exec(line.text.toString())) {
                arr.push(i);
            }
        }
        this.foldLines(arr);
    }

    private async foldLines(foldLines: Array<number>) {
        const textEditor = vscode.window.activeTextEditor;
        if (!textEditor) { return; }
        const selection = textEditor.selection;

        for (const lineNumber of foldLines) {
            textEditor.selection = new vscode.Selection(lineNumber, 0, lineNumber, 0);
            await vscode.commands.executeCommand('editor.fold');
            console.log('folding ' + textEditor.selection.anchor.line);
        }
        textEditor.selection = selection;
        textEditor.revealRange(textEditor.selection, vscode.TextEditorRevealType.InCenter);
    }

    public wrapWithRegionAndComment(){
        vscode.commands.executeCommand(
            "editor.action.commentLine",
            "editorHasDocumentFormattingProvider && editorTextFocus",
            true
        );

        vscode.commands.executeCommand(
            "regionfolder.wrapWithRegion",
            "editorHasDocumentFormattingProvider && editorTextFocus",
            true
        );
    }

    public wrapWithRegion() {
        var regionWrapper = new RegionWrapperService(this._configService);
        regionWrapper.wrapCurrentWithRegion();
    }

    
 */

public registerFoldingRangeProvider() {
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
        this._configService = configService;
        this._foldingRangeProvider =  this.registerFoldingRangeProvider();

         this._fileMonitor = new FileMonitor();
        this._fileMonitor.onLanguageIdChanged.add((doc, oldLID,newLID)=>{
            
            //visibleTextEdito

            // vscode.window.showTextDocument(doc, 1, false).then(e => {
            //     e.edit(edit => {
            //         edit.insert(new vscode.Position(0, 0), "Your advertisement here");
            //     });
            
                console.log("FileMonitor has detected change in language: " + newLID);
        });
    }

}
/* #endregion */