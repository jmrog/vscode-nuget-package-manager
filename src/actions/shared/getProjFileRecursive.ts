import * as fs from 'fs';
import * as path from 'path';
import { flattenNestedArray, handleError } from '../../utils';
import { projFileExtensionMatcher } from '../../constants';

const nodeModulesMatcher = path.sep === '/' ? /\/node_modules\// : /\\node_modules\\/;

export default function getProjFileRecursive(startPath: string): Promise<Array<string> | never> {
    return new Promise((resolve, reject) => {
        fs.readdir(startPath, (err, files) => {
            if (err) {
                return handleError(err, err.message, reject);
            }

            const promises = files.map((fileName) => new Promise((resolve: (value: Array<string>) => any, reject) => {
                const filePath = path.resolve(startPath, fileName);

                if (nodeModulesMatcher.test(filePath)) {
                    resolve([]);
                    return;
                }

                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        return handleError(err, err.message, reject);
                    }
                    
                    if (stats) {
                        if (stats.isFile() && projFileExtensionMatcher.test(filePath)) {
                            return resolve([filePath]);
                        }

                        if (stats.isDirectory()) {
                            return getProjFileRecursive(filePath).then(resolve);
                        }
                    }

                    resolve([]);
                });
            }));

            Promise.all(promises).then((tree) => {
                resolve(flattenNestedArray(tree));
            });
        });
    });
}
