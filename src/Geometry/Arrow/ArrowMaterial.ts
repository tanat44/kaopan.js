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

export class ArrowMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      side: DoubleSide,
      depthTest: false,
    });
  }
}
