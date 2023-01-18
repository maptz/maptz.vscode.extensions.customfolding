"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as config from "./config/Configuration";
import { IConfiguration } from "./config/IConfiguration";
import { Engine } from "./engine/Engine";

export function activate(context: vscode.ExtensionContext) {



  /* #region  Initial Activation */
  const configService = new config.ConfigurationService(context);
  const eng = new Engine(configService);



  const commands = [];
  commands.push({
    name: "regionfolder.wrapWithRegion",
    action: () => eng.wrapWithRegion()
  });
  commands.push({
    name: "regionfolder.wrapWithRegionAndComment",
    action: () => eng.wrapWithRegionAndComment()
  });
  commands.push({
    name: "regionfolder.collapseDefault",
    action: () => eng.collapseAllDefaultFolds()
  });
  commands.push({
    name: "regionfolder.collapseAllRegions",
    action: () => eng.collapseAllRegions()
  });
  commands.push({
    name: "regionfolder.deleteRegion",
    action: () => eng.deleteCurrentRegion()
  });
  commands.push({
    name: "regionfolder.removeCurrentRegionTags",
    action: () => eng.removeCurrentRegionTags()
  });
  commands.push({
    name: "regionfolder.selectCurrentRegion",
    action: () => eng.selectCurrentRegion()
  });
  commands.push({
    name: "regionfolder.selectCurrentRegionContents",
    action: () => eng.selectCurrentRegionContents()
  });


  for (let comm of commands) {
    let disp = vscode.commands.registerCommand(comm.name, comm.action);
    context.subscriptions.push(disp);
  }
  /* #endregion */
  if (configService.getOptions().showRegionsInOutline) {
    console.log("Showing regions in outline");
    const supportedLanguages = configService.getSupportedLanguages();
    for (let lang of supportedLanguages) {
      var metadata = new SwmfDocumentSymbolMetadata();
      context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
          { scheme: "file", language: lang },
          new SwmfConfigDocumentSymbolProvider(configService, lang), metadata)
      );
    }
  }
}

// this method is called when your extension is deactivated
export function deactivate() { }

class SwmfConfigDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

  constructor(private configService: config.ConfigurationService, public languageId: string) {

  }

  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[]> {

    const langConfig = this.configService.getConfigurationForCurrentLanguage(this.languageId);
    return new Promise((resolve, reject) => {
      if (!langConfig) {
        resolve([]);
      }
      let symbols: vscode.DocumentSymbol[] = [];
      for (var i = 0; i < document.lineCount; i++) {
        var line = document.lineAt(i);

        if (!langConfig) { continue; }
        var start = new RegExp(langConfig.foldStartRegex, "i"); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
        var startMatch = <RegExpExecArray>start.exec(line.text);

        if (startMatch) {
          var idx = langConfig.foldStart.indexOf("[NAME]");
          var suffixLen = langConfig.foldStart.length - idx - 6;

          var symName = line.text.substring(startMatch.index + idx);
          if (suffixLen > 0) {
            symName = symName.substring(0, symName.length - suffixLen);
          }

          let symbol = new vscode.DocumentSymbol(
            symName, 'r',
            vscode.SymbolKind.Function,
            line.range, line.range);
          symbols.push(symbol);
        }
      }
      resolve(symbols);
    });
  }
}

class SwmfDocumentSymbolMetadata implements vscode.DocumentSymbolProviderMetadata {
  public label = "#regions";
}