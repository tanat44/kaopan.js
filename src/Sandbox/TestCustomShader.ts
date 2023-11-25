import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Mesh,
  ShaderMaterial,
} from "three";
import { Engine } from "../Engine/Engine";

export function createTestCustomShaderObject(engine: Engine) {
  const geometry = new BufferGeometry();
  const vertices = new Float32Array([
    -0.5,
    0,
    -0.5, // v0
    0.5,
    0,
    -0.5, // v1
    0.5,
    0,
    0.5, // v2
    0.5,
    0,
    0.5, // v3
    -0.5,
    0,
    0.5, // v4
    -0.5,
    0,
    -0.5, // v5
  ]);
  geometry.setAttribute("position", new BufferAttribute(vertices, 3));
  let uniforms = {
    stroke: { value: 1 },
    alpha: { value: 0.7 },
  };
  let material = new ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragment(),
    vertexShader: vertex(),
    transparent: true,
    side: DoubleSide,
    depthTest: false,
  });
  let mesh = new Mesh(geometry, material);
  mesh.scale.set(300, 1, 700);
  mesh.position.setY(10);
  engine.sceneManager.addObject(mesh, true);
}

function vertex() {
  return `
  varying vec3 data; 
  varying vec3 scale;
  varying float strokeAlpha;

  void main() {
    data = position;
    scale = vec3(modelMatrix[0][0],modelMatrix[1][1],modelMatrix[2][2]);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
  }
`;
}

function fragment() {
  return `
  uniform vec3 colorA; 
  uniform vec3 colorB; 
  uniform float stroke;
  uniform float alpha;
  varying vec3 data;
  varying vec3 scale;

  void main() {
    float a = alpha;
    float size = 0.5;
    vec3 scaleStroke = stroke / scale;
    if (data.x > -size + scaleStroke.x && data.x < size - scaleStroke.x && data.z > -size + scaleStroke.z && data.z < size - scaleStroke.z){
      a = 0.0;
    }
    gl_FragColor = vec4(1.0, 0, 0.5, a);
  }
`;
}
