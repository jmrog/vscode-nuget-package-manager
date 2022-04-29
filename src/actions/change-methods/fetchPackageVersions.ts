import * as vscode from 'vscode';
import fetch from 'node-fetch';

import { clearStatusBar } from '../shared';
import { NUGET_VERSIONS_URL, CANCEL } from '../../constants';
import { getFetchOptions } from '../../utils';

export default function fetchPackageVersions(selectedPackage: any, versionsUrl: string = NUGET_VERSIONS_URL): Promise<any> | Promise<never> {
    if (!selectedPackage) {
        // User has canceled the process.
        return Promise.reject(CANCEL);
    }

    vscode.window.setStatusBarMessage('Loading package versions...');

    return new Promise((resolve) => {
        let selectedPackageVersion:string = '';
        [ selectedPackage, selectedPackageVersion ] = selectedPackage.selectedPackage.split(/\s/);
        fetch(`${versionsUrl}${selectedPackage}/index.json`, getFetchOptions(vscode.workspace.getConfiguration('http')))
            .then((response: Response) => {
                clearStatusBar();
                resolve({ response, selectedPackage, selectedPackageVersion });
            });
    });
}
