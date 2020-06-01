"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as config from "./config/Configuration";
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

}

// this method is called when your extension is deactivated
export function deactivate() { }
