import * as vscode from 'vscode';

export default function showSearchBox(): Thenable<string | undefined> {
    return vscode.window.showInputBox({
        placeHolder: 'Enter a package name or search term to search for a NuGet package'
    });
}
