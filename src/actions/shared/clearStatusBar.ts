import * as vscode from 'vscode';

export default function clearStatusBar(): void {
    vscode.window.setStatusBarMessage('');
}
