import * as vscode from 'vscode';
import * as path from 'path';

import { emptyString, CANCEL, REMOVE } from '../constants';
import { showInformationMessage, clearStatusBar, checkProjFilePath, showProjFileQuickPick } from './shared';

import {
    showSearchBox,
    showPackagesQuickPick,
    fetchPackageVersions,
    showVersionsQuickPick,
    handleVersionsQuickPick,
    handleVersionsResponse,
    writeFile
} from './change-methods';

import {
    readInstalledPackages
} from './remove-methods';

export function changeNuGetPackage() {
    checkProjFilePath(vscode.workspace.rootPath)
        .then((result: Array<string>): string | Thenable<string> => {
            if (result.length === 1) {
                return result[0];
            }

            return showProjFileQuickPick(result, REMOVE);
        })
        .then(readInstalledPackages)
        .then(showPackagesQuickPick)
        .then(fetchPackageVersions)  
        .then(handleVersionsResponse)
        .then(showVersionsQuickPick)
        .then(handleVersionsQuickPick)
        .then(writeFile)
        .then(showInformationMessage)
        .then(undefined, (err) => {
            clearStatusBar();
            if (err !== CANCEL) {
                vscode.window.showErrorMessage(err.message || err || 'Something went wrong! Please try again.');
            }
        });
}

