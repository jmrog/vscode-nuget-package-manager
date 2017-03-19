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

export function removeNuGetPackage() {
    checkCsprojPath(vscode.workspace.rootPath)
        .then((result: Array<string>): string | Thenable<string> => {
            if (result.length === 1) {
                return result[0];
            }

            return showCsprojQuickPick(result, REMOVE);
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
