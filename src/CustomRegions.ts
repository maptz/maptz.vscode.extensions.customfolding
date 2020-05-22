/* #region  Imports */
"use strict";
import * as vscode from "vscode";
import * as config from "./IConfiguration";
import { start } from "repl";
/* #endregion */

/* #region  RegionTagType */
enum RegionTagType { Unknown, Start, End }
/* #endregion */

/* #region  RegionTag */
class RegionTag {
    public regionTagType: RegionTagType;
    public startCharacter?: number;
    public endCharacter?: number;
    public fullText?: string;
    public lineNumber : number;
    public name?: string;
    constructor(type: RegionTagType) {
        this.regionTagType = type;
    }

    static Unknown() {
        return new RegionTag(RegionTagType.Unknown);
    }

    static FromRegex(regExpMatch: RegExpExecArray, tagType: RegionTagType, lineNumber: number) {
        var name = regExpMatch.length > 1 ? regExpMatch[1] : "";
        var regionTag = new RegionTag(tagType);
        regionTag.startCharacter = regExpMatch.index;
        regionTag.endCharacter = regExpMatch[0].length;
        regionTag.name = name;
        regionTag.lineNumber = lineNumber;
        regionTag.fullText = regExpMatch[0];
        return regionTag;
    }
}
/* #endregion */

/* #region  CustomRegion */
class CustomRegion {
    public startRegionTag: RegionTag;
    public endRegionTag: RegionTag;

    public get lineStart() : number{
        if (this.startRegionTag){
            return this.startRegionTag.lineNumber;
        }
        return -1;
    }

    public get lineEnd() : number {
        if (this.endRegionTag){
            return this.endRegionTag.lineNumber;
        }
        return -1;
    }
    
    public get name() : string {
        if (this.startRegionTag && this.startRegionTag.name){
            return this.startRegionTag.name;
        }
        return "";
    }
    

    constructor(startRegionTag:  RegionTag, endRegionTag: RegionTag = RegionTag.Unknown()) {
        this.startRegionTag = startRegionTag;
        this.endRegionTag = endRegionTag;
    }
}
/* #endregion */

/* #region  RegionProvider */
export class RegionProvider {
    private _configuration: config.IConfiguration;
    public get configuration() { return this._configuration; }
    public set configuration(value: config.IConfiguration) {
        if (this._configuration !== value) {
            this._configuration = value;
        }
    }

    constructor(config: config.IConfiguration) {
        this._configuration = config;

    }

    public getRegions(document: vscode.TextDocument): { completedRegions: CustomRegion[], errors: string[] } {
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
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            var line = lines[lineIndex];
            for (let regionTag of regionTags) {
                var start = new RegExp(regionTag.foldStartRegex, "i"); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
                var end = new RegExp(regionTag.foldEndRegex, "i");

                var startMatch = start.exec(line);
                var endMatch = end.exec(line);
                if (startMatch) {
                    var startRegionTag = RegionTag.FromRegex(startMatch, RegionTagType.Start, lineIndex);
                    var customRegion = new CustomRegion(startRegionTag);
                    startedRegions.push(customRegion);
                } else if (endMatch) {
                    if (startedRegions.length === 0) {
                        errors.push(
                            `Found an end region with no matching start tag at line ${lineIndex}`
                        );
                        continue;
                    }
                    var endTag = RegionTag.FromRegex(endMatch, RegionTagType.End, lineIndex);
                    var lastStartedRegion = startedRegions[startedRegions.length - 1];
                    var finishedRegion = new CustomRegion(lastStartedRegion.startRegionTag,endTag);
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
        };
    }
}

/* #endregion */