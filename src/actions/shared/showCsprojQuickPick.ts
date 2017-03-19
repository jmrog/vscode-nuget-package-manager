import * as vscode from 'vscode';

import { truncateCsprojPath } from './';
import { CANCEL, REMOVE, ADD } from '../../constants';

/**
 * Helper method for getting the placeholder text.
 *
 * @param {string} action
 * @returns {string}
 */
function getPlaceholder(action: string): string {
    const preposition = action === REMOVE ? 'From' : 'To';
    return `${preposition} which .csproj file do you wish to ${action.toLowerCase()} this dependency?`;
}

export default function showCsprojQuickPick(foundCsproj: Array<string>, action: string): Thenable<string> | Thenable<never> {
    // Truncate `.csproj` file paths for readability, mapping the truncated string to the full path
    // for easy retrieval once a truncated path is picked by the user.
    const truncatedPathMap = foundCsproj.reduce((newMap, csprojPath) => {
        newMap[truncateCsprojPath(csprojPath)] = csprojPath;
        return newMap;
    }, {});

    return vscode.window.showQuickPick(Object.keys(truncatedPathMap), {
        placeHolder: getPlaceholder(action)
    }).then<string | Promise<never>>((choice?: string) => {
        if (!choice) {
            // User canceled.
            return Promise.reject(CANCEL);
        }

        return truncatedPathMap[choice];
    });
}
