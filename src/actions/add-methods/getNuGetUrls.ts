import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { parseString } from 'xml2js';

import { dedupeArray, flattenNestedArray, getFetchOptions } from '../../utils';
import { NUGET_SEARCH_URL, NUGET_VERSIONS_URL } from '../../constants';

const nuGetConfigMatcher = /^nuget\.config$/i;
const finalSlashMatcher = /\/$/;

/**
 * TODO: Document limitations:
 *  - does not (currently) respect NuGet <clear /> tag
 *  - does not (currently) use <packageSourceCredentials> or <apikeys> or <disabledPackageSources>
 */
// FIXME: handle errors as in rest of project

// TODO: better typing
// Reference: https://docs.microsoft.com/en-us/nuget/reference/nuget-config-file#package-source-sections
function getPackageSourcesFromConfig(parsedNuGetConfig: any = {}): Array<string> {
    const { configuration = {} } = parsedNuGetConfig;
    const { packageSources = [] } = configuration as any;

    // TODO: Check whether these need to be reversed first; not sure how the config is standardly parsed.
    return packageSources.reduce((accumulator, packageSource) => {
        let { add: sourceEntries = [] } = packageSource as any;

        return accumulator.concat(
            sourceEntries.reduce((sourceAccumulator, entry) => {
                if (!entry.$ || !entry.$.value) {
                    return sourceAccumulator;
                }
                return sourceAccumulator.concat(entry.$.value);
            }, [])
        );
    }, []);
}

// Exported only for tests. TODO: add the tests
export function getPackageSourcesFromConfigs(nugetConfigs: Array<string>) {
    if (nugetConfigs.length === 0) {
        return Promise.resolve([]);
    }

    const packageSourcePromises = nugetConfigs.map((nugetConfig) => new Promise((resolve, reject) => {
        parseString(nugetConfig, (err, parsed: any = {}) => {
            if (err) {
                return reject(err);
            }
            return resolve(getPackageSourcesFromConfig(parsed));
        });
    }));

    return Promise.all(packageSourcePromises);
}

function getNuGetConfigContents(configPaths: Array<string>): Promise<Array<string> | never> {
    if (configPaths.length === 0) {
        return Promise.resolve([]);
    }

    const readPromises = configPaths.map((configPath) => new Promise<string>((resolve, reject) => {
        fs.readFile(configPath, 'utf-8', (err, contents) => {
            if (err) {
                return reject(err);
            }
            return resolve(contents);
        });
    }));

    return Promise.all(readPromises);
}

// Reference: https://docs.microsoft.com/en-us/nuget/api/service-index
function getSearchAndVersionUrls(nugetRepoBaseUrls: string[]) {
    const fetchPromises = nugetRepoBaseUrls.map((baseUrl) => {
        baseUrl = finalSlashMatcher.test(baseUrl) ? `${baseUrl}/index.json` : baseUrl;
        const hostName = url.parse(baseUrl).hostname;
        return fetch(baseUrl, getFetchOptions(vscode.workspace.getConfiguration('http')))
            .then((res) => res.json())
            .then((json) => {
                const { resources } = json;
                const searchUrl = resources.find((resource) => resource['@type'].startsWith('SearchAutocompleteService'))['@id'];
                const versionUrl = resources.find((resource) => resource['@type'].startsWith('PackageBaseAddress'))['@id'];
                return {
                    hostName,
                    searchUrl,
                    versionUrl,
                };
            });
    });

    return Promise.all(fetchPromises);
}

export default function getNuGetUrls(): Promise<Array<{ searchUrl: string; versionUrl: string; }> | never> {
    const ngpmConfiguration = vscode.workspace.getConfiguration('ngpm');
    const useLocalNuGetConfigs = ngpmConfiguration.get<boolean>('useLocalNuGetConfigs') || false;
    const defaultPackageSources = [{
        hostName: url.parse(NUGET_SEARCH_URL).hostname,
        searchUrl: NUGET_SEARCH_URL,
        versionUrl: NUGET_VERSIONS_URL,
    }];

    if (!useLocalNuGetConfigs) {
        return Promise.resolve(defaultPackageSources);
    }

    const readDirPromise = new Promise<Array<string> | never>((resolve, reject) => {
        fs.readdir(vscode.workspace.rootPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files);
        });
    });

    const includeDefaultPackageSources = ngpmConfiguration.get<boolean>('includeDefaultPackageSources') || true;

    return readDirPromise
        .then((files) => {
            const workspaceConfig = files.find((filename) => nuGetConfigMatcher.test(filename));
            const pathsToNuGetConfigs = ngpmConfiguration.get<Array<string>>('nonRootNugetConfigLocations') || [];

            if (workspaceConfig) {
                // Prefer the workspace's config to all others (by putting it first). This is
                // because "closer" configs take precedence: https://docs.microsoft.com/en-us/nuget/consume-packages/configuring-nuget-behavior#how-settings-are-applied
                pathsToNuGetConfigs.unshift(path.join(vscode.workspace.rootPath, workspaceConfig));
            }

            return dedupeArray(pathsToNuGetConfigs);
        })
        .then(getNuGetConfigContents)
        .then(getPackageSourcesFromConfigs)
        .then((nestedPackageSources) => flattenNestedArray(nestedPackageSources))
        .then((packageSources) => {
            const additionalNugetRepos = ngpmConfiguration.get<Array<string>>('additionalNugetRepos');
            if (additionalNugetRepos && additionalNugetRepos.length > 0) {
                return packageSources.concat(additionalNugetRepos);
            }
            return packageSources;
        })
        .then(getSearchAndVersionUrls)
        .then((nugetDetails) => includeDefaultPackageSources ? defaultPackageSources.concat(nugetDetails) : nugetDetails);
}
