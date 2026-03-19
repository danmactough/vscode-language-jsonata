// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import CompletionProvider from './language/CompletionProvider';
import NotebookKernel from './notebook/notebookKernel';
import NotebookSerializer from './notebook/notebookSerializer';
import subscribeToDocumentChanges from './language/diagnostics';
import JSONataDocumentFormatter from './language/formatter';
import { EmbeddedDocumentProvider, EMBEDDED_CONTENT_SCHEME } from './language/EmbeddedDocumentProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(new NotebookKernel());
  context.subscriptions.push(vscode.workspace.registerNotebookSerializer('jsonata-book', new NotebookSerializer(), {
    transientOutputs: false,
    transientCellMetadata: {
      inputCollapsed: true,
      outputCollapsed: true,
    },
  }));

  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
    ['jsonata'],
    new CompletionProvider(),
    '$',
  ));

  const jsonataDiagnostics = vscode.languages.createDiagnosticCollection('jsonata');
  context.subscriptions.push(jsonataDiagnostics);

  subscribeToDocumentChanges(context, jsonataDiagnostics);

  const virtualDocProvider = new EmbeddedDocumentProvider();
  vscode.workspace.registerTextDocumentContentProvider(EMBEDDED_CONTENT_SCHEME, virtualDocProvider);

  context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(
    ['jsonata', 'javascript', 'typescript', 'typescriptreact', 'javascriptreact', 'vue'],
    new JSONataDocumentFormatter(virtualDocProvider),
  ));
}

// this method is called when your extension is deactivated
export function deactivate() {}
