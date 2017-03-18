'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

import { showErrorMessage, showInformationMessage, checkCsprojPath, showCsprojQuickPick } from './shared';
import { emptyString, CANCEL, REMOVE } from '../constants';

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

    checkCsprojPath(vscode.workspace.rootPath)
        .then((result: Array<string>): string | Thenable<string> => {
            if (result.length === 1) {
                return result[0];
            }

            return showCsprojQuickPick(result, csprojFullPath, REMOVE);
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
