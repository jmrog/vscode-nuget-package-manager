import * as vscode from 'vscode';

export default function showPackagesQuickPick({
    projFileFullPath: string,
    installedPackages,
    ...otherPackageData
}: any): Thenable<string> {
    return vscode.window.showQuickPick(installedPackages)
        .then((selectedPackage: string | undefined) => ({
            projFileFullPath: string,
            selectedPackage,
            ...otherPackageData
        }));
}
