import * as vscode from 'vscode';

export default function showSearchBox(): Thenable<string | undefined> {
    return vscode.window.showInputBox({
        placeHolder: 'Select a package name'
    });
}
