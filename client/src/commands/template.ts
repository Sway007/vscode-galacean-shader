import { Range } from 'vscode';
import { WorkspaceEdit } from 'vscode';
import { window, Uri, commands, workspace } from 'vscode';

const content = `Shader "Water" {
  SubShader "water" {
    Tags { ReplacementTag = "Opaque",PipelineStage = "test" } 

    Pass "default" {
      Tags { PipelineStage = "Forward"}

      struct a2v {
       vec4 POSITION;
       vec2 TEXCOORD_0; 
      }

      struct v2f {
       vec2 v_uv;
       vec3 v_position;
      }

      mat4 u_MVPMat;
      sampler2D u_baseTexture;
      vec4 u_color;
      vec4 u_fogColor;
      float u_fogDensity;
      
      VertexShader = vert;
      FragmentShader = frag;

    #include <common>

    //   vec4 linearToGamma(vec4 linearIn) {
    //       return vec4(pow(linearIn.rgb, vec3(1.0 / 2.2)), linearIn.a);
    // }

      v2f vert(a2v v) {
        v2f o;

        o.v_uv = v.TEXCOORD_0;
        // 暂不支持 0.v_position = (u_MVPMat * POSITION).xyz写法
        vec4 tmp = u_MVPMat * POSITION;
        o.v_position = tmp.xyz;
        gl_Position = u_MVPMat * v.POSITION;
        return o;
      }

      void frag(v2f i) {
        vec4 color = texture2D(u_baseTexture, i.v_uv) * u_color;
        float fogDistance = length(i.v_position);
        float fogAmount = 1.0 - exp2(-u_fogDensity * u_fogDensity * fogDistance * fogDistance * 1.442695);
        fogAmount = clamp(fogAmount, 0.0, 1.0);
        gl_FragColor = mix(color, u_fogColor, fogAmount); 
  
        #ifndef OASIS_COLORSPACE_GAMMA
          gl_FragColor = linearToGamma(gl_FragColor);
        #endif
      }
    }
  }
}`;

export function createTemplate() {
  return commands.registerCommand('gshader.template', () => {
    const tplUri = workspace
      .getConfiguration('gshader')
      .get('tplUri') as string;

    workspace.openTextDocument({ language: 'gshader' }).then(async (doc) => {
      window.showTextDocument(doc);

      const wsEdit = new WorkspaceEdit();
      const range = new Range(0, 0, doc.lineCount, 0);
      let shaderContent = content;
      if (tplUri) {
        // window.showInformationMessage('copy content');
        shaderContent = (
          await workspace.fs.readFile(Uri.file(tplUri))
        ).toString();
      }

      wsEdit.replace(doc.uri, range, shaderContent);
      workspace.applyEdit(wsEdit);
    });
  });
}
