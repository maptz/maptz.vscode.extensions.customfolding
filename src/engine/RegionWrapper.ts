/* #region  Imports */
"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as config from "../config/Configuration";
/* #endregion */

/* #region  RegionWrapperService */
export class RegionWrapperService {
    _configService: config.ConfigurationService;
    /**
     *
     */
    constructor(configService: config.ConfigurationService) {
        this._configService = configService;
    }

    public wrapCurrentWithRegion() {
        let currentLanguageConfig = this._configService.getConfigurationForCurrentLanguage();
        if (!currentLanguageConfig) { return; }
        var ate = vscode.window.activeTextEditor;
        if (!ate) { return; }

        /* #region Check if there is anything selected. */
        if (ate.selections.length > 1 || ate.selections.length < 1) {
            return;
        }

        var sel = ate.selection;
        if (sel.isEmpty) {
            return;
        }
        /* #endregion */

        var linePrefix = ate.document.getText(
            new vscode.Range(new vscode.Position(sel.start.line, 0), sel.start)
        );
        var addPrefix = "";
        if (/^\s+$/.test(linePrefix)) {
            addPrefix = linePrefix;
        }
        var eol = this.getEOLStr(ate.document.eol);

        //Get the position of [NAME] in the fold start template.
        let regionStartTemplate = currentLanguageConfig.foldStart;
        const idx = regionStartTemplate.indexOf("[NAME]");
        const nameInsertionIndex =
            idx < 0 ? 0 : regionStartTemplate.length - "[NAME]".length - idx;
        const regionStartText = regionStartTemplate.replace("[NAME]", "");

        ate
            .edit(edit => {
                if (!currentLanguageConfig) { return; }
                if (!ate) { return; }
                //Insert the #region, #endregion tags
                edit.insert(
                    sel.end,
                    eol + addPrefix + currentLanguageConfig.foldEnd
                );
                edit.insert(sel.start, regionStartText + eol + addPrefix);
            })
            .then(edit => {
                if (!currentLanguageConfig) { return; }
                if (!ate) { return; }

                //Now, move the selection point to the [NAME] position.
                var sel = ate.selection;
                var newLine = sel.start.line - 1;
                var newChar =
                    ate.document.lineAt(newLine).text.length - nameInsertionIndex;
                var newStart = sel.start.translate(
                    newLine - sel.start.line,
                    newChar - sel.start.character
                );
                var newSelection = new vscode.Selection(newStart, newStart);
                ate.selections = [newSelection];

                //Format the document
                vscode.commands.executeCommand(
                    "editor.action.formatDocument",
                    "editorHasDocumentFormattingProvider && editorTextFocus",
                    true
                );
            });
    }

    private getEOLStr(eol: vscode.EndOfLine) {
        if (eol === vscode.EndOfLine.CRLF) {
            return "\r\n";
        }
        return "\n";
    }
}
/* #endregion */
