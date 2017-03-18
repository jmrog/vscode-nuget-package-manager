'use strict';
import * as fs from 'fs';
import { Builder as XMLBuilder } from 'xml2js';

import { handleError } from '../../utils';
import { CANCEL } from '../../constants';

const xmlBuilder = new XMLBuilder();
const writeErrorMessage = 'Failed to write an updated .csproj file. Please try again later.';

export default function deletePackageReference({ csprojFullPath, selectedPackage, parsed, packageRefSection }: any): Promise<string | never> {
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

        let xml;

        try {
            xml = xmlBuilder.buildObject(parsed);
        }
        catch (ex) {
            return handleError(ex, writeErrorMessage, reject);
        }

        fs.writeFile(csprojFullPath, xml, (err) => {
            if (err) {
                return handleError(err, writeErrorMessage, reject);
            }

            return resolve(`Success! Removed ${selectedPackageName}@${selectedPackageVersion} from ${csprojFullPath}. Run dotnet restore to update your project.`);
        });
    });
}
