import * as vscode from 'vscode';

import { handleError } from '../../utils';
import { getCsprojRecursive } from './';

export default function checkCsprojPath(startPath: string): Promise<Array<string> | never> {
    return getCsprojRecursive(startPath)
        .then((foundCsproj: Array<string>) => {
            if (foundCsproj.length < 1) {
                return handleError<Promise<never>>(
                    null,
                    'Cannot find any .csproj file for your project! Please fix this error and try again.',
                    Promise.reject.bind(Promise)
                );
            }

            return foundCsproj;
        });
}
