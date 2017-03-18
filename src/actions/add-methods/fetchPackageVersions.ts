import * as vscode from 'vscode';
import fetch from 'node-fetch';

import { clearStatusBar } from '../shared';
import { NUGET_VERSIONS_URL, CANCEL } from '../../constants';

export default function fetchPackageVersions(selectedPackageName: string, versionsUrl: string = NUGET_VERSIONS_URL): Promise<any> {
    if (!selectedPackageName) {
        // User has canceled the process.
        return Promise.reject(CANCEL);
    }

    vscode.window.setStatusBarMessage('Loading package versions...');

    return new Promise((resolve) => {
        fetch(`${versionsUrl}${selectedPackageName}/index.json`)
            .then((response: Response) => {
                clearStatusBar();
                resolve({ response, selectedPackageName });
            });
    });
}
