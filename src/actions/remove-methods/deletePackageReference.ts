'use strict';
import * as fs from 'fs';
import { Builder as XMLBuilder } from 'xml2js';

import { handleError } from '../../utils';
import { CANCEL } from '../../constants';

const xmlBuilder = new XMLBuilder();

export default function deletePackageReference(csprojFullPath, { selectedPackage, parsed, packageRefSection }: { selectedPackage: string | undefined, parsed: any, packageRefSection: any }): Promise<string> {
    if (!selectedPackage) {
        // Search canceled.
        return Promise.reject(CANCEL);
    }

    return new Promise((resolve, reject) => {
        // Mutation of `parsed` is okay here, since we're dealing with a temporary in-memory JS representation.
        const [ selectedPackageName, selectedPackageVersion ] = selectedPackage.split(/\s/);
        const itemGroup = parsed.Project.ItemGroup;
        const packageRefSectionIdx = itemGroup.indexOf(packageRefSection);
        
        itemGroup[packageRefSectionIdx].PackageReference =
            packageRefSection.PackageReference.filter(
                (ref) => !(ref.$.Include === selectedPackageName && ref.$.Version === selectedPackageVersion)
            );

        if (itemGroup[packageRefSectionIdx].PackageReference.length === 0) {
            itemGroup.splice(packageRefSectionIdx, 1);
        }

        try {
            const xml = xmlBuilder.buildObject(parsed);

            fs.writeFile(csprojFullPath, xml, (err) => {
                if (err) {
                    return handleError(
                        err,
                        'Failed to write an updated .csproj file. Please try again later.',
                        reject
                    );
                }

                return resolve(`Success! Removed ${selectedPackageName}@${selectedPackageVersion} from ${csprojFullPath}. Run dotnet restore to update your project.`);
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
