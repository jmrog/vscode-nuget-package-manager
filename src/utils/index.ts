'use strict';
import * as vscode from 'vscode';
import find from './find';
import getQueryString from './getQueryString';

const showInformationMessage = vscode.window.showInformationMessage.bind(vscode.window);
const showErrorMessage = vscode.window.showErrorMessage.bind(vscode.window);

export {
    find,
    getQueryString,
    showInformationMessage,
    showErrorMessage
};
