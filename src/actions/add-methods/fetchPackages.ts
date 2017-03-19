import * as vscode from 'vscode';
import * as qs from 'querystring';
import fetch from 'node-fetch';

import { NUGET_SEARCH_URL, CANCEL } from '../../constants';

export default function fetchPackages(input: string, searchUrl: string = NUGET_SEARCH_URL): Promise<Response> | Promise<never> {
    if (!input) {
        // Search canceled.
        return Promise.reject(CANCEL);
    }

    vscode.window.setStatusBarMessage('Searching NuGet...');

    return fetch(`${searchUrl}?` + qs.stringify({
        q: input,
        prerelease: 'true',
        take: '100'
    }));
}
