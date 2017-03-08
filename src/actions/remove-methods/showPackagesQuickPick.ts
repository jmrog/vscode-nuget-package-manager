'use strict';
import * as vscode from 'vscode';

export default function showPackagesQuickPick({ installedPackages, packageRefSection, parsed }: { installedPackages: string[], packageRefSection: any, parsed: any }): Thenable<any> {
    return vscode.window.showQuickPick(installedPackages)
        .then((selectedPackage: string | undefined) => ({ selectedPackage, parsed, packageRefSection }));
}
