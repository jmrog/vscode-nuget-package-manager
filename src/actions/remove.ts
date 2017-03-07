'use strict';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { parseString, Builder as XMLBuilder } from 'xml2js';

import { showErrorMessage, showInformationMessage } from '../utils';

const xmlBuilder = new XMLBuilder();
const emptyObject = {};
const emptyArray = [];
let projectName: string = '';
let csprojFullPath: string = '';

function readInstalledPackages() {
    return new Promise((resolve, reject) => {
        fs.readFile(csprojFullPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return reject(`Could not read your project's .csproj file (checked ${csprojFullPath}). Please try again.`);
            }

            parseString(data, (err, parsed: any = emptyObject) => {
                if (err) {
                    console.error(err);
                    return reject(`Could not parse the csproj file at ${csprojFullPath}. Please try again.`);
                }

                const project = parsed.Project || emptyObject;
                const itemGroup = project.ItemGroup || emptyArray;
                const packageRefSection = itemGroup.find((group) => group.PackageReference);

                if (!packageRefSection || !packageRefSection.PackageReference.length) {
                    return reject(`Could not locate package references in ${csprojFullPath}. Please try again.`);
                }
            
                const installedPackages = packageRefSection.PackageReference.map((ref) => `${ref.$.Include} ${ref.$.Version}`);

                return resolve({ installedPackages, packageRefSection, parsed });
            });
        });
    });
}

function showPackagesQuickPick({ installedPackages, packageRefSection, parsed }) {
    return vscode.window.showQuickPick(installedPackages)
        .then((selectedPackage: string) => ({ selectedPackage, parsed, packageRefSection }));
}

function deletePackageReference({ selectedPackage, parsed, packageRefSection }: { selectedPackage: string, parsed: any, packageRefSection: any }) {
    return new Promise((resolve, reject) => {
        // Mutation of `parsed` is okay here, since we're dealing with a temporary in-memory JS representation.
        const [ selectedPackageName, selectedPackageVersion ] = selectedPackage.split(/\s/);
        const itemGroup = parsed.Project.ItemGroup;
        const packageRefSectionIdx = itemGroup.indexOf(packageRefSection);
        
        itemGroup[packageRefSectionIdx].PackageReference =
            packageRefSection.PackageReference.filter(
                (ref) => !(ref.$.Include === selectedPackageName && ref.$.Version === selectedPackageVersion)
            );

        if (itemGroup[packageRefSectionIdx].PackageReference.length === 0) {
            itemGroup.splice(packageRefSectionIdx, 1);
        }

        try {
            const xml = xmlBuilder.buildObject(parsed);

            fs.writeFile(csprojFullPath, xml, (err) => {
                if (err) {
                    console.error(err);
                    return reject('Failed to write an updated .csproj file. Please try again later.');
                }

                return resolve(`Success! Removed ${selectedPackageName}@${selectedPackageVersion} from ${csprojFullPath}. Run dotnet restore to update your project.`);
            });
        }
        catch (ex) {
            console.error(ex);
            return reject('Failed to write an updated .csproj file. Please try again later.');
        }
    });
}

export function removeNuGetPackage() {
    if (!projectName || !csprojFullPath) {
        const { rootPath } = vscode.workspace;
        projectName = path.basename(rootPath);
        csprojFullPath = path.join(rootPath, `${projectName}.csproj`);
    }

    readInstalledPackages()
        .then(showPackagesQuickPick)
        .then(deletePackageReference)
        .then(showInformationMessage, showErrorMessage);
}
