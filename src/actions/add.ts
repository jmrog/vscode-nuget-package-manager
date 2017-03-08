'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

import { showInformationMessage, showErrorMessage, clearStatusBar } from '../utils/';
import { emptyString, CANCEL } from '../constants';
import {
    showSearchBox,
    handleSearchInput,
    handleSearchResponse,
    handlePackageQuickPick,
    handleVersionsResponse,
    handleVersionsQuickPick,
    writeFile
} from './add-methods';

// TODO: Support project.json as well as .csproj
let projectName = emptyString
let csprojFullPath = emptyString;

export function addNuGetPackage() {
    if (!projectName || !csprojFullPath) {
        const { rootPath } = vscode.workspace;
        projectName = path.basename(rootPath);
        csprojFullPath = path.join(rootPath, `${projectName}.csproj`);
    }

    showSearchBox()
        .then(handleSearchInput)
        .then(handleSearchResponse)
        .then(handlePackageQuickPick)
        .then(handleVersionsResponse)
        .then(handleVersionsQuickPick.bind(null, csprojFullPath))
        .then(writeFile.bind(null, csprojFullPath))
        .then(showInformationMessage, (err) => {
            clearStatusBar();
            if (err !== CANCEL) {
                showErrorMessage(err);
            }
        });
}

