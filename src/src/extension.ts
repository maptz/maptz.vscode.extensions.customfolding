'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as Maptz from './MyFoldingRangeProvider';

console.log('maptz-');

/* #region */
//Some code goes here
/* #endregion */

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "code-fold-extension" is now active!');

    var disposables = [];
    // let disposable1 = vscode.commands.registerCommand('extension.collapseAll', () => {
    //     vscode.commands.executeCommand("editor.foldAll");
    //     vscode.window.showInformationMessage('CollapseAll');
    // });
    // disposables.push(disposable1);

    // let disposable2 = vscode.commands.registerCommand('extension.expandAll', () => {
    //     // The code you place here will be executed every time your command is executed
    //     // Display a message box to the user
    //     vscode.window.showInformationMessage('ExpandAll');
    //     vscode.commands.executeCommand("editor.unfoldAll");
    // });
    disposables.push(disposable2);

    let disposable3 = vscode.commands.registerCommand('regionfolder.wrapWithRegion', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('wrap');
        if (vscode.window.activeTextEditor) {
            var ate = vscode.window.activeTextEditor;
            var lookup = new LanguageIdRegionLookup();
            var regionText = lookup.getRegionText(ate.document.languageId);
            if (ate.selections.length > 1 || ate.selections.length < 1) {
                return;
            }

            var sel = ate.selection;
            if (sel.isEmpty) { return; }

            var linePrefix = ate.document.getText(new vscode.Range(new vscode.Position(sel.start.line, 0), sel.start));
            var addPrefix = "";
            if (/^\s+$/.test(linePrefix)) {
                addPrefix = linePrefix;
            }
            var eol = getEOLStr(ate.document.eol);

            ate.edit(edit => {
                edit.insert(sel.end, eol + addPrefix + regionText.end);
                edit.insert(sel.start, regionText.start + eol + addPrefix);

            }).then(edit => {
                var sel = ate.selection
                var newLine = sel.start.line - 1;
                var newChar = ate.document.lineAt(newLine).text.length - regionText.nameInsertionIndex;
                var newStart = sel.start.translate(newLine - sel.start.line, newChar - sel.start.character);
                var newSelection = new vscode.Selection(newStart, newStart);
                ate.selections = [newSelection];


                //todo work out how to check 'editorHasDocumentFormattingProvider'
                vscode.commands.executeCommand("editor.action.formatDocument", "editorHasDocumentFormattingProvider && editorTextFocus", true);
            });;

        }


    });
    disposables.push(disposable3);

    //See https://github.com/Microsoft/vscode/issues/48526
    //{ scheme: 'file', language: 
    vscode.languages.registerFoldingRangeProvider(supportedLanguages, new Maptz.MyFoldingRangeProvider());

    for (var disp of disposables) {
        context.subscriptions.push(disp);
    }
}

var supportedLanguages = ["c",
    "cpp",
    "csharp",
    "css",
    "javascript",
    "json",
    "less",
    "typescript",
    "html",
    "markdown"];

var getEOLStr = function (eol: vscode.EndOfLine) {
    if (eol == vscode.EndOfLine.CRLF) return "\r\n";
    return "\n";
}

export class RegionText {
    public start: string = "";
    public end: string = "";
    public nameInsertionIndex: number = -1;
}
export class LanguageIdRegionLookup {
    private static getCStyleRegions() {
        var retval = new RegionText();
        retval.start = "/* #region  */";
        retval.end = "/* #endregion */";
        retval.nameInsertionIndex = 3;
        return retval;

    }


    private static getHtmlStyleRegions() {
        var retval = new RegionText();
        retval.start = "<!-- #region  -->";
        retval.end = "<!-- #endregion -->";
        retval.nameInsertionIndex = 4;
        return retval;

    }

    public getRegionText(languageId: string) {
        //https://code.visualstudio.com/docs/languages/identifiers
        switch (languageId) {
            case "c":
            case "cpp":
            case "csharp":
            case "css":
            case "javascript":
            case "json":
            case "less":
            case "typescript":
                return LanguageIdRegionLookup.getCStyleRegions();
            case "html":
            case "markdown":
                return LanguageIdRegionLookup.getHtmlStyleRegions();
            default:
                return LanguageIdRegionLookup.getCStyleRegions();
        }
    }
}


// this method is called when your extension is deactivated
export function deactivate() {
}
