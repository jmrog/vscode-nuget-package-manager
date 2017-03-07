import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { parseString, Builder as XMLBuilder } from 'xml2js';

import { getQueryString, find } from './utils/';

const xmlBuilder = new XMLBuilder();
const emptyObject = {};
const emptyArray = [];
const NUGET_SEARCH_URL = "https://api-v2v3search-0.nuget.org/autocomplete";
const NUGET_VERSIONS_URL = "https://api.nuget.org/v3-flatcontainer/";
const showInformationMessage = vscode.window.showInformationMessage.bind(vscode.window);
const showErrorMessage = vscode.window.showErrorMessage.bind(vscode.window);
let projectName: string = '';
let csprojFullPath: string = '';

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
            return Promise.reject('Could not parse the versioning information from the NuGet repository. Please try again later.');
        }
    });
}

function handleVersionsQuickPick({ selectedVersion, selectedPackageName }: { selectedVersion: string, selectedPackageName: string } ) {
    selectedVersion = selectedVersion.startsWith('Latest version') ? '*' : selectedVersion;

    return new Promise((resolve, reject) => {
        fs.readFile(csprojFullPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return reject(`Could not read the csproj file at ${csprojFullPath}. Please try again.`);
            }

            parseString(data, (err, parsed: any = emptyObject) => {
                const project = parsed.Project || emptyObject;
                const itemGroup = project.ItemGroup || emptyArray;
                const packageRefSection = itemGroup.find((group) => group.PackageReference);
            
                if (!packageRefSection) {
                    return reject(`Could not locate package references in ${csprojFullPath}. Please try again.`);
                }

                const packageReferences = packageRefSection.PackageReference;
                const existingReference = packageReferences.find((ref) => ref.$ && ref.$.Include === selectedPackageName);
                const newReference = {
                    $: {
                        Include: selectedPackageName,
                        Version: selectedVersion
                    }
                };

                // Mutation is okay here; we're just dealing with a temporary in-memory JS representation.
                if (!existingReference) {
                    packageReferences.push(newReference);
                }
                else {
                    packageReferences[packageReferences.indexOf(existingReference)] = newReference;
                }

                resolve({
                    contents: parsed,
                    selectedPackageName,
                    selectedVersion
                });
            });
        });
    });
}

function writeFile({ contents, selectedPackageName, selectedVersion }) {
    return new Promise((resolve, reject) => {
        try {
            const xml = xmlBuilder.buildObject(contents);
            fs.writeFile(csprojFullPath, xml, (err) => {
                if (err) {
                    console.error(err);
                    return reject('Failed to write an updated .csproj file. Please try again later.');
                }

                return resolve(`Success! Wrote ${selectedPackageName}@${selectedVersion} to ${csprojFullPath}. Run dotnet restore to update your project.`);
            });
        }
        catch (ex) {
            console.error(ex);
            return reject('Failed to write an updated .csproj file. Please try again later.');
        }
    });
}

export function addNuGetPackage() {
    if (!projectName || !csprojFullPath) {
        const { rootPath } = vscode.workspace;
        projectName = path.basename(rootPath);
        csprojFullPath = path.join(rootPath, `${projectName}.csproj`);
    }

    showSearchBox()
        .then(handleSearchInput)
        .then(handleSearchResponse)
        .then(handlePackageQuickPick)
        .then(handleVersionsResponse)
        .then(handleVersionsQuickPick)
        .then(writeFile)
        .then(showInformationMessage, showErrorMessage);
}

