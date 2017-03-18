'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

import { showInformationMessage, showErrorMessage, clearStatusBar } from './shared/';
import { emptyString, CANCEL } from '../constants';
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

let projectName = emptyString
let csprojFullPath = emptyString;

export function addNuGetPackage() {
    if (!projectName || !csprojFullPath) {
        const { rootPath } = vscode.workspace;
        projectName = path.basename(rootPath);
        csprojFullPath = path.join(rootPath, `${projectName}.csproj`);
    }

    showSearchBox()
        .then(fetchPackages)
        .then(handleSearchResponse)
        .then(showPackageQuickPick)
        .then(fetchPackageVersions)
        .then(handleVersionsResponse)
        .then(showVersionsQuickPick)
        .then(handleVersionsQuickPick.bind(null, csprojFullPath))
        .then(writeFile)
        .then(showInformationMessage)
        .then(undefined, (err) => {
            clearStatusBar();
            if (err !== CANCEL) {
                showErrorMessage(err);
            }
        });
}

