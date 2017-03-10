'use strict';
import * as vscode from 'vscode';
import handleError from './handleError';
import clearStatusBar from './clearStatusBar';

const showInformationMessage = vscode.window.showInformationMessage.bind(vscode.window);
const showErrorMessage = vscode.window.showErrorMessage.bind(vscode.window);

export {
    showInformationMessage,
    showErrorMessage,
    handleError,
    clearStatusBar
};
