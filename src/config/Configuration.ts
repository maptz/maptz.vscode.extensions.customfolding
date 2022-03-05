/* #region  Imports */
"use strict";
import * as vscode from "vscode";
import * as config from "./IConfiguration";
import * as defaultConfig from "./DefaultConfiguration";
/* #endregion */

/* #region  ConfigurationService */
export class ConfigurationService {


    public onConfigurationChanged: (() => void) | null = null;
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

    protected raiseConfigurationChanged() {
        if (this.onConfigurationChanged) {
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
                if (!configuration[prop].disableFolding) {
                    supportedLanguages.push(languageName);
                }
            }
        }
        return supportedLanguages;
    }


    public loadConfiguration() {
        let loadedConfig = <config.IConfiguration>vscode.workspace
            .getConfiguration()
            .get<config.IConfiguration>("maptz.regionfolder");

        let loadedConfigO = Object.assign(
            {}, loadedConfig
        );

        let config: config.IConfiguration = Object.assign(
            {},
            defaultConfig.DefaultConfiguration
        );
        config = Object.assign(config, loadedConfig);
        return config;

    }

    public getConfigurationForLanguage(languageId: string): config.ILanguageConfiguration | null {
        let config = this.loadConfiguration();
        const currentLanguageConfig = config["[" + languageId + "]"];
        if ((typeof currentLanguageConfig === "undefined") || !currentLanguageConfig) {
            return null;
        }
        return currentLanguageConfig;
    }

    public getConfigurationForCurrentLanguage(languageId: string) {
        let config = this.loadConfiguration();
        if (vscode.window.activeTextEditor === null) { return null; }
        /* #region Get the configuration for the current language */

        if (!languageId) {
            var ate = vscode.window.activeTextEditor;
            if (!ate) { return null; }
            languageId = ate.document.languageId;
        }

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
/* #endregion */



