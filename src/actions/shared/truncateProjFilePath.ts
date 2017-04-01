import * as vscode from 'vscode';

export default function truncateProjFilePath(projFilePath: string, rootPath: string = vscode.workspace.rootPath): string {
    if (!rootPath) { // Can be undefined if no folder is open in VS Code.
        throw new Error('Unable to locate a workspace root path! Please open a workspace and try again.');
    }

    return projFilePath.replace(rootPath, '{root}');
}
