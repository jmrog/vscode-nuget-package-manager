import * as fs from 'fs';
import * as vscode from 'vscode';
import { parseString } from 'xml2js';

import { handleError } from '../../utils';
import { checkCsprojPath, showCsprojQuickPick, createUpdatedProjectJson } from '../shared';
import { ADD } from '../../constants';

function getErrorMessage(verb, csprojFullPath) {
    return `Could not ${verb} the file at ${csprojFullPath}. Please try again.`;
}

// TODO: Clean this up if possible.
export default function handleVersionsQuickPick({ selectedVersion, selectedPackageName }: { selectedVersion: string, selectedPackageName: string }): Promise<any> | Promise<never> {
    selectedVersion = selectedVersion.startsWith('Latest version') ? '*' : selectedVersion;

    return checkCsprojPath(vscode.workspace.rootPath)
        .then((result): string | Thenable<string> => {
            if (result.length === 1) {
                return result[0];
            }

            return showCsprojQuickPick(result, ADD);
        })
        .then((pickedCsproj) => {
            return new Promise((resolve, reject) => {
                fs.readFile(pickedCsproj, 'utf8', (err, data) => {
                    if (err) {
                        return handleError(err, getErrorMessage('read', pickedCsproj), reject);
                    }

                    parseString(data, (err, parsed: any = {}) => {
                        if (err) {
                            return handleError(err, getErrorMessage('parse', pickedCsproj), reject);
                        }

                        try {
                            var contents = createUpdatedProjectJson(parsed, selectedPackageName, selectedVersion);
                        }
                        catch (ex) {
                            return handleError(ex, getErrorMessage('parse', pickedCsproj), reject);
                        }

                        return resolve({
                            pickedCsproj,
                            contents,
                            selectedPackageName,
                            selectedVersion
                        });
                    });
                });
            });
        });
}
