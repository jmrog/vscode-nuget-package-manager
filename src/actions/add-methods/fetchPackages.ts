import * as vscode from 'vscode';
import * as qs from 'querystring';
import fetch from 'node-fetch';

import { CANCEL } from '../../constants';
import { getFetchOptions } from '../../utils';
import { getNuGetSearchUrl } from './'

export default function fetchPackages(input: string): Promise<Response> | Promise<never> {
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

    return getNuGetSearchUrl()
        .then((searchUrls) => {
            const searchUrl = searchUrls[0];
            return fetch(`${searchUrl}?${queryParams}`, getFetchOptions(vscode.workspace.getConfiguration('http')));
        });
}
