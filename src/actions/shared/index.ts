import * as vscode from 'vscode';
import checkCsprojPath from './checkCsprojPath';
import showCsprojQuickPick from './showCsprojQuickPick';
import clearStatusBar from './clearStatusBar';
import createUpdatedProjectJson from './createUpdatedProjectJson';
import getCsprojRecursive from './getCsprojRecursive';
import truncateCsprojPath from './truncateCsprojPath';

const showInformationMessage = vscode.window.showInformationMessage.bind(vscode.window);
const showErrorMessage = vscode.window.showErrorMessage.bind(vscode.window);

export {
    checkCsprojPath,
    showCsprojQuickPick,
    clearStatusBar,
    showInformationMessage,
    showErrorMessage,
    createUpdatedProjectJson,
    getCsprojRecursive,
    truncateCsprojPath
};
