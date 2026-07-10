import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	console.log('DevPilot AI is now active!');

	const disposable = vscode.commands.registerCommand('devpilot-ai.openChat', async () => {
		
		const panel = vscode.window.createWebviewPanel(
			'devpilotAI',
			'DevPilot AI',
			vscode.ViewColumn.Beside,
			{ enableScripts: true }
		);

		const htmlPath = path.join(context.extensionPath, 'src', 'sidebar.html');
		panel.webview.html = fs.readFileSync(htmlPath, 'utf8');

		panel.webview.onDidReceiveMessage(async (message) => {
			if (message.command === 'ask') {
				try {
					const response = await fetch('http://localhost:11434/api/generate', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							model: 'llama3.2',
							prompt: message.text,
							stream: false
						})
					});

					const data = await response.json() as { response: string };

					panel.webview.postMessage({
						command: 'response',
						text: data.response
					});
				} catch (error) {
					panel.webview.postMessage({
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