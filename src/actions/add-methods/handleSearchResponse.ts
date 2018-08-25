import * as vscode from 'vscode';

export default function handleSearchResponse(response: Response): Promise<any> | Promise<never> {
    if (!response.ok) {
        return Promise.resolve(null);
        // return Promise.reject('A NuGet package repository returned a bad response. Please try again later.');
    }

    return response.json();
}
