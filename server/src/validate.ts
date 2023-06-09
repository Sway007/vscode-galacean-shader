import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
} from 'vscode-languageserver/node';
import {
  parseShader,
  defineConfig,
  IException,
  IShaderInfo,
} from 'galacean-shader-parser';

defineConfig({ debug: true });

export let cachedShaderInfo: IShaderInfo | undefined;
export let diagnostics: Diagnostic[] = [];

export function resetShaderInfo() {
  diagnostics = [];
  cachedShaderInfo = undefined;
}

export async function validateTextDocument(textDocument: TextDocument) {
  const text = textDocument.getText();

  let hintInfos: IException[] = [];

  resetShaderInfo();

  try {
    const result = parseShader(text);
    cachedShaderInfo = result;
    hintInfos = result.context.warnings;
  } catch (e) {
    hintInfos = e as any;
  }

  if (hintInfos.length > 0) {
    hintInfos.forEach((item) => {
      const start: Position = {
        // @ts-ignore
        line: (item.previousToken?.endLine ?? item.token.startLine!) - 1,
        // @ts-ignore
        character: item.previousToken?.endColumn ?? item.token.startColumn!,
      };
      const end: Position = {
        line: item.token.endLine! - 1,
        character: item.token.endColumn!,
      };

      diagnostics.push({
        range: { start, end },
        message: item.message,
        severity: item.severity ?? DiagnosticSeverity.Error,
      });
    });
  }
}
