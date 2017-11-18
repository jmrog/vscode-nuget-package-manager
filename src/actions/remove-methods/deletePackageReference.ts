import * as fs from 'fs';
import { Builder as XMLBuilder } from 'xml2js';

import { handleError, getProjFileExtension, isHeadlessXML } from '../../utils';
import { CANCEL } from '../../constants';

const getErrorMessage = (projFileFullPath: string): string => {
    const extension = getProjFileExtension(projFileFullPath);
    const fileDescription = extension ? `.${extension}` : 'project';
    return `Failed to write an updated ${fileDescription} file. Please try again later.`;
}

export default function deletePackageReference({
    projFileFullPath,
    selectedPackage,
    parsed,
    packageRefSection,
    originalContents = ''
}: any): Promise<string> | Promise<never> {
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

        const xmlBuilder = new XMLBuilder({
            headless: isHeadlessXML(originalContents)
        });
        let xml;

        try {
            xml = xmlBuilder.buildObject(parsed);
        }
        catch (ex) {
            return handleError(ex, getErrorMessage(projFileFullPath), reject);
        }

        fs.writeFile(projFileFullPath, xml, (err) => {
            if (err) {
                return handleError(err, getErrorMessage(projFileFullPath), reject);
            }

            return resolve(`Success! Removed ${selectedPackageName}@${selectedPackageVersion} from ${projFileFullPath}. Run dotnet restore to update your project.`);
        });
    });
}
