import * as vscode from 'vscode';

import { handleError } from '../../utils';
import { getProjFileRecursive } from './';

export default function checkProjFilePath(startPath: string): Promise<Array<string> | never> {
    return getProjFileRecursive(startPath)
        .then((foundProjFile: Array<string>) => {
            if (foundProjFile.length < 1) {
                return handleError<Promise<never>>(
                    null,
                    'Cannot find any .csproj or .fsproj file for your project! Please fix this error and try again.',
                    Promise.reject.bind(Promise)
                );
            }

            return foundProjFile;
        });
}
