'use strict';
import * as fs from 'fs';
import { Builder as XMLBuilder } from 'xml2js';

import { handleError } from '../../utils';

const xmlBuilder = new XMLBuilder();

export default function writeFile(csprojFullPath: string, { contents, selectedPackageName, selectedVersion }): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const xml = xmlBuilder.buildObject(contents);
            fs.writeFile(csprojFullPath, xml, (err) => {
                if (err) {
                    return handleError(
                        err,
                        'Failed to write an updated .csproj file. Please try again later.',
                        reject
                    );
                }

                return resolve(`Success! Wrote ${selectedPackageName}@${selectedVersion} to ${csprojFullPath}. Run dotnet restore to update your project.`);
            });
        }
        catch (ex) {
            return handleError(
                ex,
                'Failed to write an updated .csproj file. Please try again later.',
                reject
            );
        }
    });
}
