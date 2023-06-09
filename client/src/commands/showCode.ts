import { commands } from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node';

export function showCode(client: LanguageClient) {
  return commands.registerCommand('gshader.showCode', () => {
    client.sendNotification('client/showCode', { content: 'content' });
  });
}
