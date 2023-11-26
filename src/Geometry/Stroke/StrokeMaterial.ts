import { Color, DoubleSide, ShaderMaterial, Uniform, Vector4 } from "three";

const VERTEX = `
  varying vec3 data; 
  varying vec3 scale;
  varying float distance;
  varying float strokeAlpha;

  void main() {
    data = position;
    scale = vec3(modelMatrix[0][0],modelMatrix[1][1],modelMatrix[2][2]);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 

    // distance from camera
    vec4 cs_position = modelViewMatrix * vec4(position, 1.0);
    distance = -cs_position.z ;
  }
`;

const FRAGMENT = `
  uniform float stroke;
  uniform vec4 color;
  varying vec3 data;
  varying vec3 scale;
  varying float distance;

  void main() {
    float alpha = color.w;
    float size = 0.5;
    vec3 scaleStroke = stroke / scale;
    if (data.x > -size + scaleStroke.x && data.x < size - scaleStroke.x && data.z > -size + scaleStroke.z && data.z < size - scaleStroke.z){
      alpha = 0.0;
    }
    gl_FragColor = vec4(color.xyz, alpha);
  }
`;

export class StrokeMaterial extends ShaderMaterial {
  constructor(color: Color = new Color(0.27, 0.59, 0.97), alpha: number = 1.0) {
    super({
      uniforms: {
        stroke: { value: 2 },
        color: new Uniform(new Vector4(color.r, color.g, color.b)),
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      side: DoubleSide,
      depthTest: false,
    });
  }

  setStroke(value: number) {
    this.uniforms.stroke.value = value;
  }

  setAlpha(value: number) {
    this.uniforms.alpha.value = value;
  }
}
