import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import fetch from 'node-fetch';

import getQueryString from './utils/getQueryString';

let projectName: string = '';
let csprojFullPath: string = '';

const NUGET_SEARCH_URL = "https://api-v2v3search-0.nuget.org/autocomplete";
const NUGET_VERSIONS_URL = "https://api.nuget.org/v3-flatcontainer/";

function showSearchBox() {
    return vscode.window.showInputBox({
        placeHolder: 'Begin typing to search for a NuGet package'
    });
}

function handleSearchInput(input: string | undefined) {
    if (!input) {
        return Promise.reject('The search was canceled or an empty string was provided.');
    }

    vscode.window.setStatusBarMessage('Searching NuGet...');

    return fetch(`${NUGET_SEARCH_URL}?` + getQueryString({
        q: input,
        prerelease: 'true',
        take: '100'
    }));
}

function handleSearchResponse(response: Response) {
    if (!response.ok) {
        return Promise.reject('The NuGet package repository returned a bad response. Please try again later.');
    }

    return response.json().then((json) => {
        const { data } = json;
    
        if (!data || data.length < 1) {
            return Promise.reject('No matching results found. Please try again.');
        }

        return vscode.window.showQuickPick(data);
    });
}

function handlePackageQuickPick(selectedPackageName: string) {
    vscode.window.setStatusBarMessage('Loading package versions...');

    return new Promise((resolve) => {
        fetch(`${NUGET_VERSIONS_URL}${selectedPackageName}/index.json`)
            .then((response: Response) => {
                resolve({ response, selectedPackageName });
            });
    });
}

function handleVersionsResponse({ response, selectedPackageName }: { response: Response, selectedPackageName: string }) {
    if (!response.ok) {
        return Promise.reject('Versioning information could not be retrieved from the NuGet package repository. Please try again later.');
    }

    return response.json().then((json) => {
        try {
            const versions = json.versions.slice().reverse().concat('Latest version (Wildcard *)');

            return new Promise((resolve) => {
                vscode.window.showQuickPick(versions, {
                    placeHolder: 'Select the version to add.'
                }).then((selectedVersion: string) => resolve({ selectedVersion, selectedPackageName }));
            });
        }
        catch (ex) {
            console.error(ex);
            return Promise.reject('Could not parse the NuGet versions response. Please try again later.');
        }
    });
}

function handleVersionsQuickPick({ selectedVersion, selectedPackageName }: { selectedVersion: string, selectedPackageName: string } ) {
    selectedVersion = selectedVersion.startsWith('Latest version') ? '*' : selectedVersion;

    return new Promise((resolve, reject) => {
        fs.readFile(csprojFullPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return reject(`Could not read the csproj file at ${csprojFullPath}. Please try again later.`);
            }

            console.log(data);
        });
    });
}

export function addNuGetPackage() {
    if (!projectName || !csprojFullPath) {
        const { rootPath } = vscode.workspace;
        // FIXME: projectName = path.basename(rootPath);
        projectName = 'fake';
        csprojFullPath = path.join('wut', `${projectName}.csproj`);
    }

    showSearchBox()
        .then(handleSearchInput)
        .then(handleSearchResponse)
        .then(handlePackageQuickPick)
        .then(handleVersionsResponse)
        .then(handleVersionsQuickPick);
}

