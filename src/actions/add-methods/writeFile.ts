import * as fs from 'fs';
import * as vscode from 'vscode';
import { Builder as XMLBuilder } from 'xml2js';

import { handleError, getProjFileExtension, isHeadlessXML } from '../../utils';

const getErrorMessage = (pickedProjFile: string): string => {
    const extension = getProjFileExtension(pickedProjFile);
    const fileDescription = extension ? `.${extension}` : 'project';

    return `Failed to write an updated ${fileDescription} file. Please try again later.`;
};

export default function writeFile({
    pickedProjFile,
    contents,
    selectedPackageName,
    selectedVersion,
    originalContents = ''
}): Promise<string | never> {
    return new Promise((resolve, reject) => {
        const xmlBuilder = new XMLBuilder({
            headless: isHeadlessXML(originalContents)
        });
        let xml;

        try {
            xml = xmlBuilder.buildObject(contents);
        }
        catch (ex) {
            return handleError(ex, getErrorMessage(pickedProjFile), reject);
        }

        fs.writeFile(pickedProjFile, xml, (err) => {
            if (err) {
                return handleError(err, getErrorMessage(pickedProjFile), reject);
            }

            return resolve(`Success! Wrote ${selectedPackageName}@${selectedVersion} to ${pickedProjFile}. Run dotnet restore to update your project.`);
        });
});
}
