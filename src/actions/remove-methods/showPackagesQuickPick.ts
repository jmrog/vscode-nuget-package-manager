import * as vscode from 'vscode';

export default function showPackagesQuickPick({ projFileFullPath, installedPackages, packageRefSection, parsed }: any): Thenable<any> {
    return vscode.window.showQuickPick(installedPackages)
        .then((selectedPackage: string | undefined) => ({ projFileFullPath, selectedPackage, parsed, packageRefSection }));
}
