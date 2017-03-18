import * as vscode from 'vscode';

import { handleError } from '../../utils';

const errorMessage = 'No matching results found. Please try again.';

export default function showPackageQuickPick(json: any): Thenable<string | undefined> | Promise<never> {
    if (!json) {
        return handleError<Promise<never>>(null, errorMessage, Promise.reject.bind(Promise));
    }

    const { data } = json;

    if (!data || data.length < 1) {
        return handleError<Promise<never>>(null, errorMessage, Promise.reject.bind(Promise));
    }

    return vscode.window.showQuickPick(data);
}
