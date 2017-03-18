'use strict';
import * as vscode from 'vscode';

export default function handleSearchResponse(response: Response): Promise<any> {
    if (!response.ok) {
        return Promise.reject('The NuGet package repository returned a bad response. Please try again later.');
    }

    return response.json();
}
