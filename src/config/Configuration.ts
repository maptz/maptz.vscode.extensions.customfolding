"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as config from "./IConfiguration";
import * as defaultConfig from "./DefaultConfiguration";

export class ConfigurationService {


    public onConfigurationChanged : (()=>void) | null = null;
    /**
     *
     */
    constructor(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.workspace.onDidChangeConfiguration(e => {
                this.raiseConfigurationChanged();
            })
          );
    }

    protected raiseConfigurationChanged(){
        if (this.onConfigurationChanged){
            this.onConfigurationChanged();
        }
        // foldingRangeProvider.configuration = loadConfiguration();
    }

    public getSupportedLanguages() {
        const supportedLanguages: string[] = [];
        const configuration = this.loadConfiguration();
        for (let prop in configuration) {
          if (prop.startsWith("[") && prop.endsWith("]")) {
            const languageName = prop.substr(1, prop.length - 2);
            supportedLanguages.push(languageName);
          }
        }
        return supportedLanguages;
      }
      

    public loadConfiguration() {
        let loadedConfig = vscode.workspace
            .getConfiguration()
            .get<config.IConfiguration>("maptz.regionfolder");
        let config: config.IConfiguration = Object.assign(
            {},
            defaultConfig.DefaultConfiguration
        );
        config = Object.assign(config, loadedConfig);
        return config;
    }

    public getConfigurationForLanguage(languageId: string) : config.ILanguageConfiguration | null {
        let config = this.loadConfiguration();
        const currentLanguageConfig = config["[" + languageId + "]"];
        if ((typeof currentLanguageConfig === "undefined") || !currentLanguageConfig) {
            return null;
        }
        return currentLanguageConfig;
    }

    public getConfigurationForCurrentLanguage() {
        let config = this.loadConfiguration();
        if (vscode.window.activeTextEditor === null) { return null; }
        /* #region Get the configuration for the current language */
        var ate = vscode.window.activeTextEditor;
        if (!ate) { return null; }
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
}



