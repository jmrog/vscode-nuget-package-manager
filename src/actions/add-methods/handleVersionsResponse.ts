'use strict';
import * as vscode from 'vscode';

import { CANCEL } from '../../constants';
import { handleError } from '../../utils';

export default function handleVersionsResponse({ response, selectedPackageName }: { response: Response, selectedPackageName: string }): Promise<any> {
    if (!response.ok) {
        return Promise.reject('Versioning information could not be retrieved from the NuGet package repository. Please try again later.');
    }

    return response.json().then((json) => {
        try {
            const versions = json.versions.slice().reverse().concat('Latest version (Wildcard *)');

            return new Promise((resolve) => {
                vscode.window.showQuickPick(versions, {
                    placeHolder: 'Select the version to add.'
                }).then((selectedVersion: string | undefined) => {
                    if (!selectedVersion) {
                        return Promise.reject(CANCEL);
                    }
                    resolve({ selectedVersion, selectedPackageName });
                });
            });
        }
        catch (ex) {
            return handleError(
                ex,
                'Could not parse the versioning information from the NuGet repository. Please try again later.',
                Promise.reject.bind(Promise)
            );
        }
    });
}
