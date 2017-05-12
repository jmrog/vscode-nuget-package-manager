import * as vscode from 'vscode';
import * as qs from 'querystring';
import fetch from 'node-fetch';

import { NUGET_SEARCH_URL, CANCEL } from '../../constants';
import { getFetchOptions } from '../../utils';

export default function fetchPackages(input: string, searchUrl: string = NUGET_SEARCH_URL): Promise<Response> | Promise<never> {
    if (!input) {
        // Search canceled.
        return Promise.reject(CANCEL);
    }

    vscode.window.setStatusBarMessage('Searching NuGet...');

    const queryParams = qs.stringify({
        q: input,
        prerelease: 'true',
        take: '100'
    });

    return fetch(`${searchUrl}?${queryParams}`, getFetchOptions(vscode.workspace.getConfiguration('http')));
}
