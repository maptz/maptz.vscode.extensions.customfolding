"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as config from "./IConfiguration";

enum RegionTagType { Start, End }

class RegionTag{
  public regionTagType : RegionTagType;
  public startCharacter : number;
  public endCharacter: number;
  public text: string;

  constructor(type: RegionTagType){
    this.regionTagType = type;
  }
}

class CustomRegion {

  public lineStart: number;
  public lineEnd?: number;
  public name: string;
  public startRegionTag: RegionTag;
  public endRegionTag: RegionTag;

  /**
   *
   */
  constructor(lineStart: number, name: string, lineEnd?: number) {
    this.lineStart = lineStart;
    this.name = name;
    this.lineEnd = lineEnd;
    this.startRegionTag = null;
    this.endRegionTag = null;
  }
}

export class RegionProvider{
  private _configuration: config.IConfiguration;
  public get configuration() { return this._configuration;}
  public set configuration(value: config.IConfiguration){
    if (this._configuration !== value){
      this._configuration = value;
    }
  }

  constructor(config: config.IConfiguration) {
    this._configuration = config;    
 
  }

  public getRegions(document: vscode.TextDocument) : { completedRegions: CustomRegion[], errors: string[]}{
    const languageId = document.languageId;
    
    const currentLanguageConfig = this._configuration["[" + languageId + "]"];
    if ((typeof currentLanguageConfig === "undefined") || !currentLanguageConfig) {
        return {
          completedRegions: [],
          errors: []
        };
    }
    let regionTags = [currentLanguageConfig];
    var startedRegions: CustomRegion[] = [];
    var completedRegions: CustomRegion[] = [];
    var text = document.getText();
    var lines = text.split("\n");
    
    var errors = [];
    for (let i = 0; i < lines.length; i++) {
      var line = lines[i];
      for (let regionTag of regionTags) {
        var start = new RegExp(regionTag.foldStartRegex, "i"); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
        var end = new RegExp(regionTag.foldEndRegex, "i");

        if (start.exec(line)) {
          var match = <RegExpMatchArray>line.match(regionTag.foldStartRegex);
          var name = match.length > 1 ? match[1] : "";

          var cr = new CustomRegion(i, name);
          var startRegionTag = new RegionTag(RegionTagType.Start);
          //TODO: Add StartRegionTagDetails. 
          cr.startRegionTag = startRegionTag;
          startedRegions.push(cr);
        } else if (end.exec(line)) {
          if (startedRegions.length === 0) {
            errors.push(
              `Found an end region with no matching start tag at line ${i}`
            );
            continue;
          }
          var lastStartedRegion = startedRegions[startedRegions.length - 1];
          lastStartedRegion.lineEnd = i;
          var finishedRegion = new CustomRegion(
            lastStartedRegion.lineStart,
            lastStartedRegion.name,
            i
          );
          var endRegionTag = new RegionTag(RegionTagType.End);
          //TODO: Add EndRegionTag details. 
          finishedRegion.endRegionTag = endRegionTag;
          
          completedRegions.push(finishedRegion);
          startedRegions.pop();
        }
      }
    }

    if (startedRegions.length > 0) {
      for (let err of startedRegions) {
        errors.push(
          `Found a started region with no matching end tag at line ${
            err.lineStart
          }`
        );
      }
    }

    


    return {
      completedRegions: completedRegions,
      errors: errors
    }
  }
}


export class MyFoldingRangeProvider implements vscode.FoldingRangeProvider {

    private _configuration: config.IConfiguration;
    public get configuration() { return this._configuration;}
    public set configuration(value: config.IConfiguration){
      if (this._configuration !== value){
        this._configuration = value;
      }
    }

constructor(config: config.IConfiguration) {
    this._configuration = config;    

    //You may have to implement a default Folding range provider: 
    //https://github.com/Microsoft/vscode/blob/master/src/vs/editor/contrib/folding/indentRangeProvider.ts
}

  provideFoldingRanges(
    document: vscode.TextDocument,
    context: vscode.FoldingContext,
    token: vscode.CancellationToken
  ): vscode.FoldingRange[] {
    const regionProvider = new RegionProvider(this.configuration);
    var regions = regionProvider.getRegions(document);

    var crs: vscode.FoldingRange[] = [];
    for(let region of regions.completedRegions){
      var foldingRange = new vscode.FoldingRange(
        region.lineStart,
        <number>region.lineEnd,
        vscode.FoldingRangeKind.Region
      );
      crs.push(foldingRange);
    }

    
    return crs;
  }
}
