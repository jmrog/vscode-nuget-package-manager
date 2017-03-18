'use strict';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Builder as XMLBuilder } from 'xml2js';

import { handleError } from '../../utils';

const xmlBuilder = new XMLBuilder();
const writeErrorMessage = 'Failed to write an updated .csproj file. Please try again later.';

export default function writeFile({ pickedCsproj, contents, selectedPackageName, selectedVersion }): Promise<string> {
    return new Promise((resolve, reject) => {
        let xml;

        try {
            xml = xmlBuilder.buildObject(contents);
        }
        catch (ex) {
            return handleError(ex, writeErrorMessage, reject);
        }

        fs.writeFile(pickedCsproj, xml, (err) => {
            if (err) {
                return handleError(err, writeErrorMessage, reject);
            }

            return resolve(`Success! Wrote ${selectedPackageName}@${selectedVersion} to ${pickedCsproj}. Run dotnet restore to update your project.`);
        });
    });
}
