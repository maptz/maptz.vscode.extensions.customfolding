/* #region  Imports */
"use strict";
import * as vscode from "vscode";
import * as config from "./../config/Configuration";
import { ILanguageConfiguration, IFoldConfiguration } from "./../config/IConfiguration";
/* #endregion */

/* #region  RegionTagType */
export enum RegionTagType { Unknown, Start, End }
/* #endregion */

/* #region  RegionTag */
export class RegionTag {
    public regionTagType: RegionTagType;
    public startCharacter?: number;
    public endCharacter?: number;
    public fullText?: string;
    public lineNumber: number;
    public name?: string;
    constructor(type: RegionTagType) {
        this.regionTagType = type;
        this.lineNumber = -1;
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
export class CustomRegion {
    public startRegionTag: RegionTag;
    public endRegionTag: RegionTag;

    public contains(pos: vscode.Position) {
        var ln = pos.line;
        return ln >= this.lineStart && ln <= this.lineEnd;
    }
    public get lineStart(): number {
        if (this.startRegionTag) {
            return this.startRegionTag.lineNumber;
        }
        return -1;
    }

    public get lineEnd(): number {
        if (this.endRegionTag) {
            return this.endRegionTag.lineNumber;
        }
        return -1;
    }

    public get name(): string {
        if (this.startRegionTag && this.startRegionTag.name) {
            return this.startRegionTag.name;
        }
        return "";
    }

    public isDefaultRegion: boolean = false;


    constructor(startRegionTag: RegionTag, endRegionTag: RegionTag = RegionTag.Unknown()) {
        this.startRegionTag = startRegionTag;
        this.endRegionTag = endRegionTag;
    }
}
/* #endregion */

/* #region  RegionProvider */
export class RegionProvider {
    private _configurationService: config.ConfigurationService;
    public get configuration() { return this._configurationService; }
    public set configuration(value: config.ConfigurationService) {
        if (this._configurationService !== value) {
            this._configurationService = value;
        }
    }

    constructor(configService: config.ConfigurationService) {
        this._configurationService = configService;
    }

    public getRegions(document: vscode.TextDocument): { completedRegions: CustomRegion[], errors: string[] } {
        const languageId = document.languageId;
        console.log(`RegionProvider.getRegions - Getting regions for language ${languageId}.`);

        const currentLanguageConfig = this._configurationService.getConfigurationForLanguage(languageId);
        if (!currentLanguageConfig) {
            return {
                completedRegions: [],
                errors: []
            };
        }

        let foldDefinitions = <IFoldConfiguration[]>[currentLanguageConfig];
        if (currentLanguageConfig.foldDefinitions) {
            for (let foldDefinition of currentLanguageConfig.foldDefinitions) {
                foldDefinitions.push(foldDefinition);
            }
        }


        var completedRegions: CustomRegion[] = [];
        var text = document.getText();
        var lines = text.split("\n");

        var errors = [];
        for (let foldDefinition of foldDefinitions) {

            var startedRegions: CustomRegion[] = [];
            var start = new RegExp(foldDefinition.foldStartRegex, "i"); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
            var end = new RegExp(foldDefinition.foldEndRegex, "i");

            for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                var line = lines[lineIndex];

                var startMatch = start.exec(line);
                var endMatch = end.exec(line);
                if (startMatch) {
                    var startRegionTag = RegionTag.FromRegex(startMatch, RegionTagType.Start, lineIndex);
                    var customRegion = new CustomRegion(startRegionTag);

                    if ((<ILanguageConfiguration>foldDefinition).defaultFoldStartRegex) {
                        var regexPatt = <string>(<ILanguageConfiguration>foldDefinition).defaultFoldStartRegex;
                        var defaultRE = new RegExp(regexPatt, "i");
                        if (defaultRE.exec(line)) {
                            customRegion.isDefaultRegion = true;
                        }
                    }
                    else if (foldDefinition.isFoldedByDefault) {
                        customRegion.isDefaultRegion = true;
                    }
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
                    var finishedRegion = new CustomRegion(lastStartedRegion.startRegionTag, endTag);
                    finishedRegion.isDefaultRegion = lastStartedRegion.isDefaultRegion;
                    completedRegions.push(finishedRegion);
                    startedRegions.pop();
                }


            }


            if (startedRegions.length > 0) {
                for (let err of startedRegions) {
                    errors.push(
                        `Found a started region with no matching end tag at line ${err.lineStart
                        }`
                    );
                }
            }
        }

        console.log(`RegionProvider.getRegions - ${completedRegions.length} completed regions.`);
        return {
            completedRegions: completedRegions,
            errors: errors
        };
    }
}

/* #endregion */
