/* #region  Imports */
"use strict";
import * as vscode from "vscode";

import * as config from "./../config/Configuration";
import {RegionProvider, CustomRegion} from "./CustomRegions";
/* #endregion */


/* #region  RegionService */
export class RegionService {
    regionProvider: RegionProvider;
    document: vscode.TextDocument;
    regions: CustomRegion[];

    /**
     *
     */
    constructor(configService: config.ConfigurationService, document: vscode.TextDocument) {
        this.regionProvider = new RegionProvider(configService);
        this.document = document;
        this.regions = [];
    }
    public update() {
        var result = this.regionProvider.getRegions(this.document);
        this.regions = result.completedRegions;
    }

    public getRegions(){
        this.update();
        return this.regions;
    }

    public currentRegions(): CustomRegion[] {
        this.update();
        var ate = vscode.window.activeTextEditor;
        if (!ate) { return []; }
        if (this.document !== ate.document) {
            return [];
        }
        var surroundingRegions = [];
        for (let reg of this.regions) {
            if (reg.contains(ate.selection.active)) {
                surroundingRegions.push(reg);
            }
        }
        return surroundingRegions;
    }

    public currentRegion(): CustomRegion | null {
        var currentRegions = this.currentRegions();
        if (currentRegions.length === 0) { return null; }

        return currentRegions[0];
        return currentRegions[currentRegions.length - 1];
    }


}
/* #endregion */

