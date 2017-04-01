import * as vscode from 'vscode';
import * as path from 'path';

import { showErrorMessage, showInformationMessage, checkProjFilePath, showProjFileQuickPick } from './shared';
import { emptyString, CANCEL, REMOVE } from '../constants';

import {
    readInstalledPackages,
    showPackagesQuickPick,
    deletePackageReference
} from './remove-methods';

export function removeNuGetPackage() {
    checkProjFilePath(vscode.workspace.rootPath)
        .then((result: Array<string>): string | Thenable<string> => {
            if (result.length === 1) {
                return result[0];
            }

            return showProjFileQuickPick(result, REMOVE);
        })
        .then(readInstalledPackages)
        .then(showPackagesQuickPick)
        .then(deletePackageReference)
        .then(showInformationMessage)
        .then(undefined, (err) => {
            if (err !== CANCEL) {
                showErrorMessage(err);
            }
        });
}
