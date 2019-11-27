import * as vscode from 'vscode';

import { CANCEL } from '../../constants';
import { handleError } from '../../utils';

export default function showVersionsQuickPick({ json, selectedPackage, selectedPackageVersion }: { json: any, selectedPackage: string, selectedPackageVersion: string }): Promise<any | never> {
    // TODO: This could probably use more error handling.
    
    // let versions = json.versions.slice().reverse().concat('Latest version (Wildcard *)');
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

    // TODO: highlight currently selected version

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