import * as vscode from 'vscode';

import { CANCEL } from '../../constants';
import { handleError } from '../../utils';

export default function showVersionsQuickPick({ json, selectedPackageName }: { json: any, selectedPackageName: string }): Promise<any | never> {
    // TODO: This could probably use more error handling.
    const versions = json.versions.slice().reverse().concat('Latest version (Wildcard *)');

    return new Promise((resolve, reject) => {
        vscode.window.showQuickPick(versions, {
            placeHolder: 'Select the version to add.'
        }).then((selectedVersion: string | undefined) => {
            if (!selectedVersion) {
                // User canceled.
                return reject(CANCEL);
            }
            resolve({ selectedVersion, selectedPackageName });
        });
    });
}