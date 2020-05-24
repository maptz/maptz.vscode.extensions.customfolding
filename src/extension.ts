"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as config from "./config/Configuration";
import {Engine } from "./engine/Engine";


console.log("Extension loaded");

export function activate(context: vscode.ExtensionContext) {
  
   const configService = new config.ConfigurationService(context);
   //AN ERROR HERE
   const eng = new Engine(configService);
  
  // const commands = [];
  // commands.push({
  //   name: "regionfolder.wrapWithRegion",
  //   action: () => eng.wrapWithRegion()
  // });
  // commands.push({
  //   name: "regionfolder.wrapWithRegionAndComment",
  //   action: () => eng.wrapWithRegion()
  // });
  // commands.push({
  //   name: "regionfolder.collapseDefault",
  //   action: () => eng.doDefaultFold()
  // });
  // commands.push({
  //   name: "regionfolder.collapseAllRegions",
  //   action: () => eng.collapseAllRegions()
  // });
  // commands.push({
  //   name: "regionfolder.deleteCurrentRegions",
  //   action: () => eng.deleteCurrentRegion()
  // });

  
  // for(let comm of commands){
  //   let disp = vscode.commands.registerCommand(comm.name, comm.action);
  //   context.subscriptions.push(disp);
  // }

  
}



// this method is called when your extension is deactivated
export function deactivate() { }
