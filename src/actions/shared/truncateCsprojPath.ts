import * as vscode from 'vscode';

export default function truncateCsprojPath(csprojPath: string, rootPath: string = vscode.workspace.rootPath): string {
    if (!rootPath) { // Can be undefined if no folder is open in VS Code.
        throw new Error('Unable to locate a workspace root path! Please open a workspace and try again.');
    }

    return csprojPath.replace(rootPath, '{root}');
}
