import * as vscode from 'vscode';

export default function showPackagesQuickPick({
    projFileFullPath,
    installedPackages,
    packageRefSection,
    parsed,
    originalContents
}: any): Thenable<any> {
    return vscode.window.showQuickPick(installedPackages)
        .then((selectedPackage: string | undefined) => ({
            projFileFullPath,
            selectedPackage,
            parsed,
            packageRefSection,
            originalContents
        }));
}
