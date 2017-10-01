import * as vscode from 'vscode';

export default function handleSearchResponse(response: Response): Promise<any> | Promise<never> {
    if (!response.ok) {
        return Promise.reject('The NuGet package repository returned a bad response. Please try again later.');
    }
    debugger;

    return response.json();
}
