import * as vscode from 'vscode';

export const EMBEDDED_CONTENT_SCHEME = 'meta.embedded.block' as const;
export const EMBEDDED_LANGUAGE_ID = 'jsonata' as const;

export class EmbeddedDocumentProvider implements vscode.TextDocumentContentProvider {
  // Stores content for each virtual document URI
  private content = new Map<string, string>();

  // Event for when content changes (not strictly needed for formatting)
  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();

  onDidChange = this.onDidChangeEmitter.event;

  // The method that returns the content for a given URI
  provideTextDocumentContent(uri: vscode.Uri): string {
    return this.content.get(uri.path) || '';
  }

  // A helper to create a virtual document from a template literal's range
  createVirtualDoc(document: vscode.TextDocument, range: vscode.Range): vscode.Uri {
    const text = document.getText(range);
    const uri = vscode.Uri.parse(`${EMBEDDED_CONTENT_SCHEME}://${EMBEDDED_LANGUAGE_ID}/${document.uri.path}`);
    this.content.set(uri.path, text);
    return uri;
  }
}
