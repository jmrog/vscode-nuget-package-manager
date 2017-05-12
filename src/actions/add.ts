import * as vscode from 'vscode';
import * as path from 'path';

import { emptyString, CANCEL } from '../constants';
import { showInformationMessage, clearStatusBar } from './shared/';
import {
    showSearchBox,
    fetchPackages,
    handleSearchResponse,
    showPackageQuickPick,
    fetchPackageVersions,
    handleVersionsResponse,
    showVersionsQuickPick,
    handleVersionsQuickPick,
    writeFile
} from './add-methods';

export function addNuGetPackage() {
    showSearchBox()
        .then(fetchPackages)
        .then(handleSearchResponse)
        .then(showPackageQuickPick)
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

