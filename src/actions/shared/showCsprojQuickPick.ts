import * as vscode from 'vscode';

import { CANCEL, REMOVE, ADD } from '../../constants';

function getPlaceholder(action: string): string {
    const preposition = action === REMOVE ? 'From' : 'To';
    return `${preposition} which .csproj file do you wish to ${action.toLowerCase()} this dependency?`;
}

export default function showCsprojQuickPick(foundCsproj: Array<string>, action: string): Thenable<string> | Thenable<never> {
    return vscode.window.showQuickPick(foundCsproj, {
        placeHolder: getPlaceholder(action)
    }).then<string | Promise<never>>((choice?: string) => {
        if (!choice) {
            return Promise.reject(CANCEL);
        }

        // Empty string will mean user hit Enter for default.
        return choice;
    });
}
