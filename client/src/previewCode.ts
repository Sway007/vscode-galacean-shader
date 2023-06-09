import { ViewColumn, WebviewPanel, window } from 'vscode';

let webviewPanel: WebviewPanel | undefined = undefined;
export function previewCode(shaderInfo) {
  const subShader = shaderInfo.subShaders[0];
  if (!webviewPanel) {
    webviewPanel = window.createWebviewPanel(
      'shaderCode',
      subShader.name,
      ViewColumn.Beside
    );
    webviewPanel.onDidDispose(() => {
      webviewPanel = undefined;
    });
  }
  webviewPanel.webview.html = getWebviewContent(
    subShader.passes[0].vert,
    subShader.passes[0].frag
  );
}

function getWebviewContent(vs: string, fs: string) {
  return `<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Marked in the browser</title>
	</head>
	<body>
		<h1>Vertex</h1>
		<pre><code>${vs}
		</code></pre>
		<h1>Fragment</h1>
		<pre><code>${fs}
		</code></pre>
		</script>
	</body>
</html>
	`;
}
