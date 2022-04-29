import * as vscode from 'vscode';

import { handleError } from '../../utils';

export default function handleVersionsResponse({ response, selectedPackage, selectedPackageVersion }: { response: Response, selectedPackage: string, selectedPackageVersion:string }): Promise<any> | Promise<never> {
    if (!response.ok) {
        return handleError<Promise<never>>(
            null,
            'Versioning information could not be retrieved from the NuGet package repository. Please try again later.',
            Promise.reject.bind(Promise)
        );
    }

    return response.json().then((json) => ({ json, selectedPackage, selectedPackageVersion }));
}
