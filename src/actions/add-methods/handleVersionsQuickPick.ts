import * as fs from 'fs';
import * as vscode from 'vscode';
import { parseString } from 'xml2js';

import { handleError } from '../../utils';
import { checkProjFilePath, showProjFileQuickPick, createUpdatedProjectJson } from '../shared';
import { ADD } from '../../constants';

function getErrorMessage(verb: string, projFileFullPath: string): string {
    return `Could not ${verb} the file at ${projFileFullPath}. Please try again.`;
}

// TODO: Clean this up if possible.
export default function handleVersionsQuickPick({ selectedVersion, selectedPackageName }: { selectedVersion: string, selectedPackageName: string }): Promise<any> | Promise<never> {
    selectedVersion = selectedVersion.startsWith('Latest version') ? '*' : selectedVersion;

    return checkProjFilePath(vscode.workspace.rootPath)
        .then((result): string | Thenable<string> => {
            if (result.length === 1) {
                return result[0];
            }

            return showProjFileQuickPick(result, ADD);
        })
        .then((pickedProjFile) => {
            return new Promise((resolve, reject) => {
                fs.readFile(pickedProjFile, 'utf8', (err, data) => {
                    if (err) {
                        return handleError(err, getErrorMessage('read', pickedProjFile), reject);
                    }

                    parseString(data, (err, parsed: any = {}) => {
                        if (err) {
                            return handleError(err, getErrorMessage('parse', pickedProjFile), reject);
                        }

                        try {
                            var contents = createUpdatedProjectJson(parsed, selectedPackageName, selectedVersion);
                        }
                        catch (ex) {
                            return handleError(ex, getErrorMessage('parse', pickedProjFile), reject);
                        }

                        return resolve({
                            pickedProjFile,
                            contents,
                            selectedPackageName,
                            selectedVersion
                        });
                    });
                });
            });
        });
}
