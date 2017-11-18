import * as fs from 'fs';
import { parseString } from 'xml2js';

import { handleError, getProjFileExtension } from '../../utils';

const getConstructedErrorMessage = (projFileFullPath: string, template: string): string => {
    const extension = getProjFileExtension(projFileFullPath);
    const fileDescription = extension ? `.${extension}` : 'project';
    return template.replace(/{{extension}}/g, fileDescription).replace(/{{projFileFullPath}}/g, projFileFullPath);
}

export default function readInstalledPackages(projFileFullPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(projFileFullPath, 'utf8', (err, data) => {
            if (err) {
                return handleError(
                    err,
                    getConstructedErrorMessage(
                        projFileFullPath,
                        "Could not read your project's {{extension}} file (checked {{projFileFullPath}}). Please try again."
                    ),
                    reject
                );
            }

            parseString(data, (err, parsed: any = {}) => {
                if (err || !parsed) {
                    return handleError(
                        err,
                        getConstructedErrorMessage(
                            projFileFullPath,
                            `Could not parse the {{extension}} file at {{projFileFullPath}}. Please try again.`
                        ),
                        reject
                    );
                }

                const project = parsed.Project || {};
                const itemGroup = project.ItemGroup || [];
                const packageRefSection = itemGroup.find((group) => group.PackageReference);

                if (!packageRefSection || !packageRefSection.PackageReference.length) {
                    return reject(`Could not locate package references in ${projFileFullPath}. Please try again.`);
                }
            
                const installedPackages = packageRefSection.PackageReference.map((ref) => `${ref.$.Include} ${ref.$.Version}`);

                return resolve({
                    projFileFullPath,
                    installedPackages,
                    packageRefSection,
                    parsed,
                    originalContents: data
                });
            });
        });
    });
}
