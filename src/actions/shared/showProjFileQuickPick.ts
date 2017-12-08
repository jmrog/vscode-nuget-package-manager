import * as vscode from 'vscode';

import { truncateProjFilePath } from './';
import { CANCEL, REMOVE, ADD } from '../../constants';

/**
 * Helper method for getting the placeholder text.
 *
 * @param {string} action
 * @returns {string}
 */
function getPlaceholder(action: string): string {
    const preposition = action === REMOVE ? 'From' : 'To';
    return `${preposition} which project file do you wish to ${action.toLowerCase()} this dependency?`;
}

export default function showProjFileQuickPick(foundProjFiles: Array<string>, action: string): Thenable<string> | Thenable<never> {
    // Truncate `.[fc]sproj` file paths for readability, mapping the truncated string to the full path
    // for easy retrieval once a truncated path is picked by the user.
    const truncatedPathMap = foundProjFiles.reduce((newMap, projFilePath) => {
        newMap[truncateProjFilePath(projFilePath)] = projFilePath;
        return newMap;
    }, {});

    return vscode.window.showQuickPick(Object.keys(truncatedPathMap), {
        placeHolder: getPlaceholder(action)
    }).then<string | never>((choice?: string) => {
        if (!choice) {
            // User canceled.
            return Promise.reject(CANCEL);
        }

        return truncatedPathMap[choice];
    });
}
