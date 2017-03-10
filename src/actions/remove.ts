'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

import { showErrorMessage, showInformationMessage } from '../utils';
import { emptyString, CANCEL } from '../constants';

import {
    readInstalledPackages,
    showPackagesQuickPick,
    deletePackageReference
} from './remove-methods';

// TODO: Support project.json as well as .csproj
let projectName = emptyString;
let csprojFullPath = emptyString;

export function removeNuGetPackage() {
    if (!projectName || !csprojFullPath) {
        const { rootPath } = vscode.workspace;
        projectName = path.basename(rootPath);
        csprojFullPath = path.join(rootPath, `${projectName}.csproj`);
    }

    readInstalledPackages(csprojFullPath)
        .then(showPackagesQuickPick)
        .then(deletePackageReference.bind(null, csprojFullPath))
        .then(showInformationMessage)
        .then(undefined, (err) => {
            if (err !== CANCEL) {
                showErrorMessage(err);
            }
        });
}
