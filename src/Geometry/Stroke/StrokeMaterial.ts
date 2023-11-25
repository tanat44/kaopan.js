import { DoubleSide, ShaderMaterial } from "three";

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
  uniform float alpha;
  varying vec3 data;
  varying vec3 scale;
  varying float distance;

  void main() {
    float a = alpha;
    float size = 0.5;
    vec3 scaleStroke = stroke / scale;
    if (data.x > -size + scaleStroke.x && data.x < size - scaleStroke.x && data.z > -size + scaleStroke.z && data.z < size - scaleStroke.z){
      a = 0.0;
    }
    // gl_FragColor = vec4(0.27, 0.59, 0.97, a);
    gl_FragColor = vec4(1.0, 0, 0, a);
  }
`;

export class StrokeMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        stroke: { value: 2 },
        alpha: { value: 1.0 },
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
