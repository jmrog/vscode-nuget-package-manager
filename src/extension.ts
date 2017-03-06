'use strict';
import * as vscode from 'vscode';
import { addNuGetPackage } from './add';
import remove from './remove';

export function activate(context: vscode.ExtensionContext) {
    const disposableCommands = [
        vscode.commands.registerCommand('extension.addNuGetPackage', addNuGetPackage),
        vscode.commands.registerCommand('extension.removeNuGetPackage', remove)
    ];

    disposableCommands.forEach((disposable) => context.subscriptions.push(disposable));
}

// this method is called when your extension is deactivated
export function deactivate() {
}
