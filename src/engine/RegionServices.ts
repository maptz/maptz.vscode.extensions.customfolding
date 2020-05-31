/* #region  Imports */
"use strict";
import * as vscode from "vscode";
import * as config from "./../config/Configuration";
import {RegionProvider, CustomRegion} from "./CustomRegions";
/* #endregion */


/* #region  RegionService */
export class RegionService {
    regionProvider: RegionProvider;
    document: vscode.TextDocument;
    regions: CustomRegion[];

    /**
     *
     */
    constructor(configService: config.ConfigurationService, document: vscode.TextDocument) {
        this.regionProvider = new RegionProvider(configService);
        this.document = document;
        this.regions = [];
    }
    public update() {
        var result = this.regionProvider.getRegions(this.document);
        this.regions = result.completedRegions;
    }

    public getRegions(){
        this.update();
        return this.regions;
    }

    public currentRegions(): CustomRegion[] {
        this.update();
        var ate = vscode.window.activeTextEditor;
        if (!ate) { return []; }
        if (this.document !== ate.document) {
            return [];
        }
        var surroundingRegions = [];
        for (let reg of this.regions) {
            if (reg.contains(ate.selection.active)) {
                surroundingRegions.push(reg);
            }
        }
        return surroundingRegions;
    }

    public currentRegion(): CustomRegion | null {
        var currentRegions = this.currentRegions();
        if (currentRegions.length === 0) { return null; }

        return currentRegions[0];
        return currentRegions[currentRegions.length - 1];
    }


}
/* #endregion */

/* #region  RegionWorkService */
// export class RegionWorkService {

//     configService: config.ConfigurationService;
//     document: vscode.TextDocument;
//     /**
//      *
//      */
//     constructor(configService: config.ConfigurationService, document: vscode.TextDocument) {
//         this.configService = configService;
//         this.document = document;
//     }

//     public commentCurrentRegion() {
//         var ate = vscode.window.activeTextEditor;
//         if (!ate) { return; }

//         var regionService = new RegionService(this.configService, this.document);
//         var currentRegion = regionService.currentRegion();
//         if (currentRegion === null) { return; }

//         var startLine = this.document.lineAt(currentRegion.lineStart);
//         var endLine = this.document.lineAt(currentRegion.lineEnd);

//         var oldSelection = ate.selection;
//         var sel = new vscode.Selection(startLine.range.start, endLine.range.end);
//         ate.selection = sel;

//         vscode.commands.executeCommand(
//             "editor.action.commentLine",
//             "editorHasDocumentFormattingProvider && editorTextFocus",
//             true
//         );

//         ate.selection = oldSelection;


//     }

//     public removeCurrentRegionTags() {
//         var regionService = new RegionService(this.configService, this.document);
//         var currentRegion = regionService.currentRegion();
//         if (currentRegion === null) { return; }

//         vscode.window.activeTextEditor?.edit(edit => {
//             if (currentRegion === null) { return; }
//             var startLine = this.document.lineAt(currentRegion.lineStart);
//             edit.delete(startLine.range);

//             var endLine = this.document.lineAt(currentRegion.lineEnd);
//             edit.delete(endLine.range);
//             // tslint:disable-next-line:no-unused-expression
//         });

//     }

//     public removeCurrentRegion() {
//         var regionService = new RegionService(this.configService, this.document);
//         var currentRegion = regionService.currentRegion();
//         if (currentRegion === null) { return; }

//         vscode.window.activeTextEditor?.edit(edit => {
//             if (currentRegion === null) { return; }
//             var startLine = this.document.lineAt(currentRegion.lineStart);
//             var endLine = this.document.lineAt(currentRegion.lineEnd);

//             var range = new vscode.Range(startLine.range.start, endLine.range.end);
//             edit.delete(range);
//             // tslint:disable-next-line:no-unused-expression
//         });

//     }
// }
/* #endregion */

