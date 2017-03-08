'use strict';
import * as vscode from 'vscode';
import fetch from 'node-fetch';

import { clearStatusBar } from '../../utils';
import { CANCEL, NUGET_VERSIONS_URL } from '../../constants';

export default function handlePackageQuickPick(selectedPackageName: string | undefined): Promise<any> {
    if (!selectedPackageName) {
        // Search canceled.
        return Promise.reject(CANCEL);
    }

    vscode.window.setStatusBarMessage('Loading package versions...');

    return new Promise((resolve) => {
        fetch(`${NUGET_VERSIONS_URL}${selectedPackageName}/index.json`)
            .then((response: Response) => {
                clearStatusBar();
                resolve({ response, selectedPackageName });
            });
    });
}
