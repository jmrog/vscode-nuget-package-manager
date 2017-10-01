import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { parseString } from 'xml2js';

import { dedupeArray, flattenNestedArray } from '../../utils';
import { NUGET_SEARCH_URL } from '../../constants';

const nuGetConfigMatcher = /^nuget\.config$/i;

/**
 * TODO: Document limitations:
 *  - does not (currently) respect NuGet <clear /> tag
 *  - does not (currently) use <packageSourceCredentials> or <apikeys> or <disabledPackageSources>
 */
// FIXME: handle errors as in rest of project

// TODO: better typing
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

export default function getNuGetSearchUrls(): Promise<Array<string> | never> {
    const ngpmConfiguration = vscode.workspace.getConfiguration('ngpm');
    const useLocalNuGetConfigs = ngpmConfiguration.get<boolean>('useLocalNuGetConfigs') || false;
    const defaultPackageSources = [NUGET_SEARCH_URL];

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

    return readDirPromise
        .then((files) => {
            const workspaceConfig = files.find((filename) => nuGetConfigMatcher.test(filename));
            const pathsToNuGetConfigs = ngpmConfiguration.get<Array<string>>('nugetConfigLocations') || [];

            if (workspaceConfig) {
                // Prefer the workspace's config to all others (by putting it first).
                pathsToNuGetConfigs.unshift(path.join(vscode.workspace.rootPath, workspaceConfig));
            }

            return dedupeArray(pathsToNuGetConfigs);
        })
        .then(getNuGetConfigContents)
        .then(getPackageSourcesFromConfigs)
        // TODO: determine whether to add defaultPackageSources to the found package sources
        .then((nestedPackageSources) => flattenNestedArray(nestedPackageSources));
}
