import * as fs from 'fs';
import * as path from 'path';
import { flattenNestedArray, handleError } from '../../utils';

const projFileMatcher = /\.[cf]sproj$/;

export default function getProjFileRecursive(startPath: string): Promise<Array<string> | never> {
    return new Promise((resolve, reject) => {
        fs.readdir(startPath, (err, files) => {
            if (err) {
                return handleError(err, err.message, reject);
            }

            const promises = files.map((fileName) => new Promise((resolve: (value: Array<string>) => any, reject) => {
                const filePath = path.resolve(startPath, fileName);

                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        handleError(err, err.message, reject);
                    }
                    
                    if (stats) {
                        if (stats.isFile() && projFileMatcher.test(filePath)) {
                            return resolve([filePath]);
                        }

                        if (stats.isDirectory()) {
                            return getProjFileRecursive(filePath).then(resolve);
                        }
                    }

                    resolve([]);
                });
            }));

            Promise.all(promises).then((tree) => resolve(flattenNestedArray(tree)));
        });
    });
}
