'use strict';
import * as vscode from 'vscode';

export default function showPackagesQuickPick({ csprojFullPath, installedPackages, packageRefSection, parsed }: any): Thenable<any> {
    return vscode.window.showQuickPick(installedPackages)
        .then((selectedPackage: string | undefined) => ({ csprojFullPath, selectedPackage, parsed, packageRefSection }));
}
