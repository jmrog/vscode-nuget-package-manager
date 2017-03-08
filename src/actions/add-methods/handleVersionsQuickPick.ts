'use strict';
import * as fs from 'fs';
import { parseString } from 'xml2js';

import { emptyObject, emptyArray } from '../../constants';
import { handleError } from '../../utils';

export default function handleVersionsQuickPick(csprojFullPath: string, { selectedVersion, selectedPackageName }: { selectedVersion: string, selectedPackageName: string }): Promise<any> {
    selectedVersion = selectedVersion.startsWith('Latest version') ? '*' : selectedVersion;

    return new Promise((resolve, reject) => {
        fs.readFile(csprojFullPath, 'utf8', (err, data) => {
            if (err) {
                return handleError(
                    err,
                    `Could not read the csproj file at ${csprojFullPath}. Please try again.`,
                    reject
                );
            }

            parseString(data, (err, parsed: any = emptyObject) => {
                if (err) {
                    return handleError(
                        err,
                        `Could not parse the csproj file at ${csprojFullPath}. Please try again.`,
                        reject
                    );
                }

                const project = parsed.Project || emptyObject;
                const itemGroup = project.ItemGroup || emptyArray;
                const packageRefSection = itemGroup.find((group) => group.PackageReference);
            
                if (!packageRefSection) {
                    return reject(`Could not locate package references in ${csprojFullPath}. Please try again.`);
                }

                const packageReferences = packageRefSection.PackageReference;
                const existingReference = packageReferences.find((ref) => ref.$ && ref.$.Include === selectedPackageName);
                const newReference = {
                    $: {
                        Include: selectedPackageName,
                        Version: selectedVersion
                    }
                };

                // Mutation is okay here; we're just dealing with a temporary in-memory JS representation.
                if (!existingReference) {
                    packageReferences.push(newReference);
                }
                else {
                    packageReferences[packageReferences.indexOf(existingReference)] = newReference;
                }

                resolve({
                    contents: parsed,
                    selectedPackageName,
                    selectedVersion
                });
            });
        });
    });
}
