'use strict';
import * as vscode from 'vscode';
import fetch from 'node-fetch';

import { getQueryString } from '../../utils';
import { CANCEL, NUGET_SEARCH_URL } from '../../constants';

export default function handleSearchInput(input: string | undefined): Promise<Response> {
    if (!input) {
        // Search canceled.
        return Promise.reject(CANCEL);
    }

    vscode.window.setStatusBarMessage('Searching NuGet...');

    return fetch(`${NUGET_SEARCH_URL}?` + getQueryString({
        q: input,
        prerelease: 'true',
        take: '100'
    }));
}
