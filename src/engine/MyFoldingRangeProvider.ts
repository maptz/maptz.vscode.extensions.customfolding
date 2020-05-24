/* #region  Imports */
"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as config from "./../config/Configuration";
import * as r from "./CustomRegions";
/* #endregion */

/* #region  MyFoldingRangeProvider */
export class MyFoldingRangeProvider implements vscode.FoldingRangeProvider {


  provideFoldingRanges(
      document: vscode.TextDocument,
      context: vscode.FoldingContext,
      token: vscode.CancellationToken
    ): vscode.FoldingRange[] {
      //HERE IS TEH ERRRO
      //const regionProvider = new r.RegionProvider(this.configurationService);
     //var regions = regionProvider.getRegions(document);

      return [];
  }
  private _configurationService: config.ConfigurationService;
  public get configurationService() { return this._configurationService; }
  public set configurationService(value: config.ConfigurationService) {
    if (this._configurationService !== value) {
      this._configurationService = value;
    }
  }

  constructor(config: config.ConfigurationService) {
    this._configurationService = config;

    //You may have to implement a default Folding range provider: 
    //https://github.com/Microsoft/vscode/blob/master/src/vs/editor/contrib/folding/indentRangeProvider.ts
  }

  // provideFoldingRanges(
  //   document: vscode.TextDocument,
  //   context: vscode.FoldingContext,
  //   token: vscode.CancellationToken
  // ): vscode.FoldingRange[] {
  //   const regionProvider = new r.RegionProvider(this.configurationService);
  //   var regions = regionProvider.getRegions(document);

  //   var crs: vscode.FoldingRange[] = [];
  //   for (let region of regions.completedRegions) {
  //     var foldingRange = new vscode.FoldingRange(
  //       region.lineStart,
  //       <number>region.lineEnd,
  //       vscode.FoldingRangeKind.Region
  //     );
  //     crs.push(foldingRange);
  //   }


  //   return crs;
  // }
}
/* #endregion */
