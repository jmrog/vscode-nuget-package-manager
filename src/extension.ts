import * as vscode from 'vscode';

import { addNuGetPackage, removeNuGetPackage, changeNuGetPackage } from './actions';

export function activate(context: vscode.ExtensionContext) {
    const disposableCommands = [
        vscode.commands.registerCommand('extension.addNuGetPackage', addNuGetPackage),
        vscode.commands.registerCommand('extension.removeNuGetPackage', removeNuGetPackage),
        vscode.commands.registerCommand('extension.changeNuGetPackage', changeNuGetPackage)
    ];

    disposableCommands.forEach((disposable) => context.subscriptions.push(disposable));
}
