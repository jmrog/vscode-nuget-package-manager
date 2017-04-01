import * as fs from 'fs';
import * as vscode from 'vscode';
import { Builder as XMLBuilder } from 'xml2js';

import { handleError, getProjFileExtension } from '../../utils';

const xmlBuilder = new XMLBuilder();

const getErrorMessage = (pickedProjectFile: string): string => {
    const extension = getProjFileExtension(pickedProjectFile);
    const fileDescription = extension ? `.${extension}` : 'project';

    return `Failed to write an updated ${fileDescription} file. Please try again later.`;
};

export default function writeFile({ pickedProjectFile, contents, selectedPackageName, selectedVersion }): Promise<string | never> {
    return new Promise((resolve, reject) => {
        try {
            var xml = xmlBuilder.buildObject(contents);
        }
        catch (ex) {
            return handleError(ex, getErrorMessage(pickedProjectFile), reject);
        }

        fs.writeFile(pickedProjectFile, xml, (err) => {
            if (err) {
                return handleError(err, getErrorMessage(pickedProjectFile), reject);
            }

            return resolve(`Success! Wrote ${selectedPackageName}@${selectedVersion} to ${pickedProjectFile}. Run dotnet restore to update your project.`);
        });
    });
}
