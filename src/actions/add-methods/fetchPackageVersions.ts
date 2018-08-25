import * as vscode from 'vscode';
import fetch from 'node-fetch';

import { clearStatusBar } from '../shared';
import { CANCEL } from '../../constants';
import { getFetchOptions } from '../../utils';

export default function fetchPackageVersions({ packageName, versionUrl }: { packageName: string; versionUrl: string }): Promise<any> | Promise<never> {
    if (!packageName) {
        // User has canceled the process.
        return Promise.reject(CANCEL);
    }

    vscode.window.setStatusBarMessage('Loading package versions...');

    return new Promise((resolve) => {
        fetch(`${versionUrl}${packageName}/index.json`, getFetchOptions(vscode.workspace.getConfiguration('http')))
            .then((response: Response) => {
                clearStatusBar();
                resolve({ response, packageName });
            });
    });
}
