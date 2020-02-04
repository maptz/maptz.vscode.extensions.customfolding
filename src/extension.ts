"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as Maptz from "./MyFoldingRangeProvider";
import * as IConfiguration from "./IConfiguration";

export async function foldLines(foldLines: Array<number>) {
  const textEditor = vscode.window.activeTextEditor;
  if (textEditor == null) return;
  const selection = textEditor.selection;

  for (const lineNumber of foldLines) {
    textEditor.selection = new vscode.Selection(lineNumber, 0, lineNumber, 0);
    await vscode.commands.executeCommand('editor.fold')
    console.log('folding ' + textEditor.selection.anchor.line);
  }
  textEditor.selection = selection;
  textEditor.revealRange(textEditor.selection, vscode.TextEditorRevealType.InCenter);
}

function loadConfiguration() {
  let loadedConfig = vscode.workspace
    .getConfiguration()
    .get<IConfiguration.IConfiguration>("maptz.regionfolder");
  let config: IConfiguration.IConfiguration = Object.assign(
    {},
    IConfiguration.DefaultConfiguration
  );
  config = Object.assign(config, loadedConfig);
  return config;
}

function loadOptionsConfiguration() {
  let loadedConfig = vscode.workspace
    .getConfiguration()
    .get<IConfiguration.IOptionsConfiguration>("maptz.regionfolderOptions");
  let config: IConfiguration.IOptionsConfiguration = Object.assign(
    {},
    IConfiguration.DefaultOptionsConfiguration
  );
  config = Object.assign(config, loadedConfig);
  return config;
}

//vscode.window.showInformationMessage("wrap");
function getSupportedLanguages() {
  const supportedLanguages: string[] = [];
  const configuration = loadConfiguration();
  for (let prop in configuration) {
    if (prop.startsWith("[") && prop.endsWith("]")) {
      const languageName = prop.substr(1, prop.length - 2);
      supportedLanguages.push(languageName);
    }
  }
  return supportedLanguages;
}

function registerFoldingRangeProvider() {
  const configuration = loadConfiguration();
  const supportedLanguages = getSupportedLanguages();
  const foldingRangeProvider = new Maptz.MyFoldingRangeProvider(configuration);
  vscode.languages.registerFoldingRangeProvider(
    supportedLanguages,
    foldingRangeProvider
  );
  return foldingRangeProvider;
}

const foldingRangeProvider = registerFoldingRangeProvider();

function getConfigurationForCurrentLanguage() {
  let config = loadConfiguration();
  if (vscode.window.activeTextEditor == null) return null;
  /* #region Get the configuration for the current language */
  var ate = vscode.window.activeTextEditor;
  const languageId = ate.document.languageId;
  const currentLanguageConfig = config["[" + languageId + "]"];
  if (
    typeof currentLanguageConfig === "undefined" ||
    !currentLanguageConfig
  ) {
    vscode.window.showInformationMessage(
      "Maptz Region Folding. No region folding available for language '" +
      languageId +
      "'. Check that you have the language extension installed for these files."
    );
    return null;
  }
  /* #endregion */
  return currentLanguageConfig;
}

export function activate(context: vscode.ExtensionContext) {
  var disposables = [];
  /* #region  wrapWithRegionCommand */
  let disposable3 = vscode.commands.registerCommand(
    "regionfolder.wrapWithRegion",
    () => {
      let currentLanguageConfig = getConfigurationForCurrentLanguage();
      if (currentLanguageConfig == null) return;
      var ate = vscode.window.activeTextEditor;
      if (ate == null) return;

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
      var eol = getEOLStr(ate.document.eol);

      //Get the position of [NAME] in the fold start template.
      let regionStartTemplate = currentLanguageConfig.foldStart;
      const idx = regionStartTemplate.indexOf("[NAME]");
      const nameInsertionIndex =
        idx < 0 ? 0 : regionStartTemplate.length - "[NAME]".length - idx;
      const regionStartText = regionStartTemplate.replace("[NAME]", "");

      ate
        .edit(edit => {
          if (currentLanguageConfig == null) return;
          if (ate == null) return;
          //Insert the #region, #endregion tags
          edit.insert(
            sel.end,
            eol + addPrefix + currentLanguageConfig.foldEnd
          );
          edit.insert(sel.start, regionStartText + eol + addPrefix);
        })
        .then(edit => {
          if (currentLanguageConfig == null) return;
          if (ate == null) return;

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
  );
  disposables.push(disposable3);
  /* #endregion */


  let disposable4 = vscode.commands.registerCommand('regionfolder.collapseDefault', () => {
    vscode.window.showInformationMessage("do-default-fold");

    let currentLanguageConfig = getConfigurationForCurrentLanguage();
    if (currentLanguageConfig == null) return;
    if (currentLanguageConfig.defaultFoldStartRegex == null) return;

    var ate = vscode.window.activeTextEditor;
    if (ate == null) return;


    var arr = [];
    for (let i = 0; i < ate.document.lineCount; i++) {
      var line = ate.document.lineAt(i);

      var start = new RegExp(currentLanguageConfig.defaultFoldStartRegex, "i");
      if (start.exec(line.text.toString())) {
        arr.push(i);
      }
    }
    foldLines(arr);

  });
  disposables.push(disposable4);


  let optionsConfig = loadOptionsConfiguration();

  /* #region  Subscribe to configuration changes */
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      foldingRangeProvider.configuration = loadConfiguration();
      optionsConfig = loadOptionsConfiguration();
    })
  );

  /* #endregion */

  /* #region  Subscript to text document opening. */
  // context.subscriptions.push(
  //   vscode.workspace.onDidChangeTextDocument(e=>{
  //   //console.log("text doc change");
  //   }));
  //   context.subscriptions.push(
      
  //     vscode.workspace.onDidOpenTextDocument(e => {
  //     if (optionsConfig.collapseDefaultRegionsOnOpen){
  //       vscode.commands.executeCommand("regionfolder.collapseDefault");
  //     }
  //   }));
  /* #endregion */

  for (var disp of disposables) {
    context.subscriptions.push(disp);
  }
}

var getEOLStr = function (eol: vscode.EndOfLine) {
  if (eol === vscode.EndOfLine.CRLF) {
    return "\r\n";
  }
  return "\n";
};

// this method is called when your extension is deactivated
export function deactivate() { }
