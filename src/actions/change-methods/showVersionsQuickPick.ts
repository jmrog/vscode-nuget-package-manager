import * as vscode from 'vscode';

import { CANCEL } from '../../constants';

export default function showVersionsQuickPick({ json, selectedPackage, selectedPackageVersion }: { json: any, selectedPackage: string, selectedPackageVersion: string }): Promise<any | never> {
    // TODO: This could probably use more error handling.
    var versions:string[]=[];
    json.versions.slice().forEach(packageVersion => {
        if (packageVersion == selectedPackageVersion) {
            versions.unshift(packageVersion+' (Currently Installed)')
        } else {
            versions.unshift(packageVersion);
        }
    });
    versions.unshift('Latest version (Wildcard *)');
    console.log(versions);

    return new Promise((resolve, reject) => {
        vscode.window.showQuickPick(versions, {
            placeHolder: 'Select the version to add.'
        }).then((selectedVersion: string | undefined) => {
            if (!selectedVersion) {
                // User canceled.
                return reject(CANCEL);
            }
            resolve({ selectedVersion, selectedPackage });
        });
    });
}