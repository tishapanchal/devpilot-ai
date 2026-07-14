import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';

let currentPanel: vscode.WebviewPanel | undefined;
let lastActiveEditor: vscode.TextEditor | undefined;

export function activate(context: vscode.ExtensionContext) {
	console.log('DevPilot AI is now active!');

	// Track the last active code editor
	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor && editor.document.uri.scheme === 'file') {
			lastActiveEditor = editor;
		}
	});

	const disposable = vscode.commands.registerCommand('devpilot-ai.openChat', async () => {

		function getWorkspaceFiles(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return '';

    let allCode = '';
    const folder = workspaceFolders[0].uri.fsPath;

    const files = fs.readdirSync(folder).filter(f => 
        f.endsWith('.ts') || f.endsWith('.js') || 
        f.endsWith('.tsx') || f.endsWith('.jsx') ||
        f.endsWith('.py') || f.endsWith('.html') ||
        f.endsWith('.css')
    );

    for (const file of files) {
        const filePath = path.join(folder, file);
        const content = fs.readFileSync(filePath, 'utf8');
        allCode += `\n\n--- File: ${file} ---\n${content}`;
    }

    return allCode;
}

		// Save current editor before opening panel
		lastActiveEditor = vscode.window.activeTextEditor || lastActiveEditor;

		currentPanel = vscode.window.createWebviewPanel(
			'devpilotAI',
			'DevPilot AI',
			vscode.ViewColumn.Beside,
			{ enableScripts: true }
		);

		const htmlPath = path.join(context.extensionPath, 'src', 'sidebar.html');
		currentPanel.webview.html = fs.readFileSync(htmlPath, 'utf8');

		currentPanel.webview.onDidReceiveMessage(async (message) => {
			if (message.command === 'analyzeCode') {
				if (!lastActiveEditor) {
					currentPanel?.webview.postMessage({
						command: 'response',
						text: 'No file is open! Please open a code file first.'
					});
					return;
				}
				const code = lastActiveEditor.document.getText();
const fileName = lastActiveEditor.document.fileName;
const workspaceCode = getWorkspaceFiles();
const prompt = `You are an expert developer assistant. 
The user has this file open: "${fileName}"

Current file content:
${code}

${workspaceCode ? `Other files in the project:${workspaceCode}` : ''}

Analyze the code, find bugs, errors, and suggest improvements.`;
				try {
					const response = await fetch('http://localhost:11434/api/generate', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							model: 'llama3.2',
							prompt: prompt,
							stream: false
						})
					});
					const data = await response.json() as { response: string };
					currentPanel?.webview.postMessage({
						command: 'response',
						text: data.response
					});
				} catch (error) {
					currentPanel?.webview.postMessage({
						command: 'response',
						text: 'Error: ' + error
					});
				}
			} else if (message.command === 'ask') {
				try {
					const response = await fetch('http://localhost:11434/api/generate', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							model: 'llama3.2',
							prompt: message.text,
							stream: true
						})
					});

					const reader = response.body?.getReader();
					const decoder = new TextDecoder();

					currentPanel?.webview.postMessage({ command: 'startStream' });

					while (true) {
						const { done, value } = await reader!.read();
						if (done) break;
						const chunk = decoder.decode(value);
						const lines = chunk.split('\n').filter(line => line.trim());
						for (const line of lines) {
							try {
								const json = JSON.parse(line) as { response: string };
								currentPanel?.webview.postMessage({
									command: 'streamChunk',
									text: json.response
								});
							} catch {}
						}
					}

					currentPanel?.webview.postMessage({ command: 'endStream' });

				} catch (error) {
					currentPanel?.webview.postMessage({
						command: 'response',
						text: 'Error: ' + error
					});
				}
			}
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}