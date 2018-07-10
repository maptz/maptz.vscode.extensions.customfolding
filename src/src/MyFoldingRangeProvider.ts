'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export class MyFoldingRangeProvider implements vscode.FoldingRangeProvider {

    private static getRegionsTags(): { start: string, end: string }[] {
        var retval = [];
        retval.push({
            end: "/\\*[\\s]*#endregion",
            start: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$",
        }, {
                end: "\\<!--[\\s]*#endregion",
                start: "\\<!--[\\s]*#region[\\s]*(.*)",
            });
        return retval;
    }

    provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.FoldingRange[] {

        var startedRegions: { lineStart: number, lineEnd?: number, name: string }[] = [];
        var completedRegions: vscode.FoldingRange[] = [];
        var text = document.getText();
        var lines = text.split("\n");
        var regionTags = MyFoldingRangeProvider.getRegionsTags();
        var errors = [];
        for (let i = 0; i < lines.length; i++) {
            var line = lines[i];
            for (let regionTag of regionTags) {
                var start = new RegExp(regionTag.start, "i"); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
                var end = new RegExp(regionTag.end, "i");

                if (start.exec(line)) {
                    var match = <RegExpMatchArray>line.match(regionTag.start);
                    var name = match.length > 1 ? match[1] : "";

                    startedRegions.push({
                        lineStart: i,
                        name: name
                    })
                }
                else if (end.exec(line)) {
                    if (startedRegions.length == 0) {
                        errors.push(`Found an end region with no matching start tag at line ${i}`);
                        continue;
                    }
                    var lastStartedRegion = startedRegions[startedRegions.length - 1];
                    lastStartedRegion.lineEnd = i;
                    var foldingRange = new vscode.FoldingRange(lastStartedRegion.lineStart, i, vscode.FoldingRangeKind.Region)
                    completedRegions.push(foldingRange);
                    startedRegions.pop();
                }
            }
        }
        if (startedRegions.length > 0) {
            for (let err of startedRegions) {
                errors.push(`Found a started region with no matching end tag at line ${err.lineStart}`);
            }
        }
        return completedRegions;
    }
}