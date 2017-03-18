import * as vscode from 'vscode';

import { CANCEL, REMOVE, ADD } from '../../constants';

function getPlaceholder(action: string, defaultChoice: string): string {
    const preposition = action === REMOVE ? 'From' : 'To';
    return `${preposition} which .csproj file do you wish to ${action.toLowerCase()} this dependency?`;
}

export default function showCsprojQuickPick(foundCsproj: Array<string>, defaultChoice: string, action: string): Thenable<string> {
    return vscode.window.showQuickPick(foundCsproj, {
        placeHolder: getPlaceholder(action, defaultChoice)
    }).then((choice: string | undefined) => {
        if (typeof choice !== 'string') {
            return <Thenable<string>>Promise.reject(CANCEL);
        }

        // Empty string will mean user hit Enter for default.
        return choice || defaultChoice;
    });
}
