import * as vscode from 'vscode';
import * as qs from 'querystring';
import fetch from 'node-fetch';

import { CANCEL } from '../../constants';
import { getFetchOptions } from '../../utils';
import { getNuGetUrls } from './'
import handleSearchResponse from './handleSearchResponse';

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

    return getNuGetUrls()
        .then((nugetUrls) => {
            // const searchUrls = nugetjUrls.map((urls) => urls.searchUrl);
            const searchPromises = nugetUrls.map((urls) =>
                fetch(`${urls.searchUrl}?${queryParams}`, getFetchOptions(vscode.workspace.getConfiguration('http')))
                    .then(handleSearchResponse)
                    .then((json) => !json ? json : { ...json, ...urls })
            );
            return Promise.all(searchPromises)
                .then((jsons) => jsons.reduce((newJson, json) => {
                    if (!json) {
                        return newJson;
                    }

                    newJson.data = newJson.data.concat(json.data.map((packageName) => ({
                        packageName,
                        searchUrl: json.searchUrl,
                        versionUrl: json.versionUrl,
                        hostName: json.hostName,
                    })));
                    return newJson;
                }, { data: [] }));
        });
}
