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
class CustomRegion {
    public startRegionTag: RegionTag;
    public endRegionTag: RegionTag;

    public contains(pos: vscode.Position) {
        var ln = pos.line;
        return ln >= this.lineStart && ln <= this.lineStart;
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


    constructor(startRegionTag: RegionTag, endRegionTag: RegionTag = RegionTag.Unknown()) {
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
                    var finishedRegion = new CustomRegion(lastStartedRegion.startRegionTag, endTag);
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

class RegionService {
    regionProvider: RegionProvider;
    document: vscode.TextDocument;
    regions: CustomRegion[];

    /**
     *
     */
    constructor(config: config.IConfiguration, document: vscode.TextDocument) {
        this.regionProvider = new RegionProvider(config);
        this.document = document;
        this.regions = [];
    }
    public update() {
        var result = this.regionProvider.getRegions(this.document);
        this.regions = result.completedRegions;
    }

    public currentRegions(): CustomRegion[] {
        if (this.document !== vscode.window.activeTextEditor?.document) {
            return [];
        }
        var surroundingRegions = [];
        for (let reg of this.regions) {
            if (reg.contains(vscode.window.activeTextEditor.selection.active)) {
                surroundingRegions.push(reg);
            }
        }
        return surroundingRegions;
    }

    public currentRegion(): CustomRegion | null {
        var currentRegions = this.currentRegions();
        if (currentRegions.length === 0) { return null; }

        return currentRegions[currentRegions.length - 1];
    }


}

class RegionWorkService {

    config: config.IConfiguration;
    document: vscode.TextDocument;
    /**
     *
     */
    constructor(config: config.IConfiguration, document: vscode.TextDocument) {
        this.config = config;
        this.document = document;
    }

    public commentCurrentRegion() {
        var ate = vscode.window.activeTextEditor;
        if (!ate) { return; }

        var regionService = new RegionService(this.config, this.document);
        var currentRegion = regionService.currentRegion();
        if (currentRegion === null) { return; }

        var startLine = this.document.lineAt(currentRegion.lineStart);
        var endLine = this.document.lineAt(currentRegion.lineEnd);

        var oldSelection = ate.selection;
        var sel = new vscode.Selection(startLine.range.start, endLine.range.end);
        ate.selection = sel;
        
        vscode.commands.executeCommand(
            "editor.action.commentLine",
            "editorHasDocumentFormattingProvider && editorTextFocus",
            true
          );

          ate.selection = oldSelection;
        

    }

    public removeCurrentRegionTags() {
        var regionService = new RegionService(this.config, this.document);
        var currentRegion = regionService.currentRegion();
        if (currentRegion === null) { return; }

        vscode.window.activeTextEditor?.edit(edit => {
            if (currentRegion === null) { return; }
            var startLine = this.document.lineAt(currentRegion.lineStart);
            edit.delete(startLine.range);

            var endLine = this.document.lineAt(currentRegion.lineEnd);
            edit.delete(endLine.range);
        });

    }

    public removeCurrentRegion() {
        var regionService = new RegionService(this.config, this.document);
        var currentRegion = regionService.currentRegion();
        if (currentRegion === null) { return; }

        vscode.window.activeTextEditor?.edit(edit => {
            if (currentRegion === null) { return; }
            var startLine = this.document.lineAt(currentRegion.lineStart);
            var endLine = this.document.lineAt(currentRegion.lineEnd);

            var range = new vscode.Range(startLine.range.start, endLine.range.end);
            edit.delete(range);
        });

    }


}

class FileMonitor{
    interval: NodeJS.Timer | null;
    document: vscode.TextDocument;
    languageId: string;
    onLanguageIdChanged: ((oldLanguageId: string, newLanguageId: string)=>void) | null ;
    

constructor(document: vscode.TextDocument) {
    this.document = document;
    this.interval = null;
    this.languageId = "";
    this.onLanguageIdChanged = null;
}

    public onFileOpen(){
        
        if(this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}

		this.interval = setTimeout(()=>{
            //TODO Check if we have a langauge service assigned
            var languageId = this.document.languageId;
            if (this.languageId !== languageId){
                var oldLanguageId = this.languageId;
                this.languageId = languageId;
                this.raiseLanguageIdChanged(oldLanguageId, languageId);
            }
		},10);
    }
    private raiseLanguageIdChanged(oldLanguageId: string, newLanguageId: string) {
        if (this.onLanguageIdChanged){
            this.onLanguageIdChanged(oldLanguageId, newLanguageId);
        }
    }
}