import * as vscode from 'vscode';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export function activate(context: vscode.ExtensionContext) {
	console.log('DevPilot AI is now active!');

	const disposable = vscode.commands.registerCommand('devpilot-ai.analyzeCode', async () => {
		
		// Get the active editor
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No file is open!');
			return;
		}

		// Get the code from the file
		const code = editor.document.getText();
		const fileName = editor.document.fileName;

		// Show loading message
		vscode.window.showInformationMessage('DevPilot AI is analyzing your code...');

		try {
			// Send code to Gemini
			const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
			const prompt = `Analyze this code and find any bugs or improvements:\n\n${code}`;
			const result = await model.generateContent(prompt);
			const response = result.response.text();

			// Show the response
			vscode.window.showInformationMessage(response.substring(0, 200));

		} catch (error) {
			vscode.window.showErrorMessage('Error analyzing code: ' + error);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}