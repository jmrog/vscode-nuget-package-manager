'use strict';
import * as vscode from 'vscode';

export default function handleSearchResponse(response: Response): Promise<string | undefined> {
    if (!response.ok) {
        return Promise.reject('The NuGet package repository returned a bad response. Please try again later.');
    }

    return response.json().then((json) => {
        const { data } = json;
    
        if (!data || data.length < 1) {
            return Promise.reject('No matching results found. Please try again.');
        }

        return vscode.window.showQuickPick(data);
    });
}
