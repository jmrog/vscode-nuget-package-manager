import * as vscode from 'vscode';

import { handleError } from '../../utils';

const errorMessage = 'No matching results found. Please try again.';

export default function showPackageQuickPick(json: any): Thenable<{ packageName: string; versionUrl: string; } | undefined> | Promise<never> {
    if (!json) {
        return handleError<Promise<never>>(null, errorMessage, Promise.reject.bind(Promise));
    }

    const { data } = json;

    if (!data || data.length < 1) {
        return handleError<Promise<never>>(null, errorMessage, Promise.reject.bind(Promise));
    }

    return vscode.window.showQuickPick(data.map((datum) => `${datum.packageName} (${datum.hostName})`))
        .then((selection: string) => {
            const splitPoint = selection.lastIndexOf(' (');
            const packageName = selection.slice(0, splitPoint);
            const hostName = selection.slice(splitPoint + 2, -1);
            const versionUrl = data.find((datum) => datum.packageName === packageName && datum.hostName === hostName).versionUrl;
            return {
                packageName,
                versionUrl
            };
        });
}
