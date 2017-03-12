'use strict';
import * as fs from 'fs';
import { parseString } from 'xml2js';

import { handleError, createUpdatedProjectJson } from '../../utils';

function getErrorMessage(verb, csprojFullPath) {
    return `Could not ${verb} the file at ${csprojFullPath}. Please try again.`;
}

export default function handleVersionsQuickPick(csprojFullPath: string, { selectedVersion, selectedPackageName }: { selectedVersion: string, selectedPackageName: string }): Promise<any> {
    selectedVersion = selectedVersion.startsWith('Latest version') ? '*' : selectedVersion;

    return new Promise((resolve, reject) => {
        fs.readFile(csprojFullPath, 'utf8', (err, data) => {
            if (err) {
                return handleError(err, getErrorMessage('read', csprojFullPath), reject);
            }

            parseString(data, (err, parsed: any = {}) => {
                if (err) {
                    return handleError(err, getErrorMessage('parse', csprojFullPath), reject);
                }

                let contents;

                try {
                    contents = createUpdatedProjectJson(parsed, selectedPackageName, selectedVersion);
                }
                catch (ex) {
                    return handleError(ex, getErrorMessage('parse', csprojFullPath), reject);
                }

                resolve({
                    contents,
                    selectedPackageName,
                    selectedVersion
                });
            });
        });
    });
}
