import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Mesh,
  ShaderMaterial,
} from "three";
import { Engine } from "../Engine/Engine";

export function createTestCustomShaderObject(engine: Engine) {
  const size = 100.0;
  const geometry = new BufferGeometry();
  const vertices = new Float32Array([
    -size,
    0,
    -size, // v0
    size,
    0,
    -size, // v1
    size,
    0,
    size, // v2
    size,
    0,
    size, // v3
    -size,
    0,
    size, // v4
    -size,
    0,
    -size, // v5
    -size / 2,
    0,
    -size / 2, // v0
    size / 2,
    0,
    -size / 2, // v1
    size / 2,
    0,
    size / 2, // v2
    size / 2,
    0,
    size / 2, // v3
    -size / 2,
    0,
    size / 2, // v4
    -size / 2,
    0,
    -size / 2, // v5
  ]);
  geometry.setAttribute("position", new BufferAttribute(vertices, 3));
  let uniforms = {
    colorB: { type: "vec3", value: new Color(0xacb6e5) },
    colorA: { type: "vec3", value: new Color(0x74ebd5) },
    width: { value: 1.0 },
    alpha: { value: 1.0 },
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
  engine.sceneManager.addObject(mesh, true);
}

function vertex() {
  return `
  varying vec3 data; 
  varying float strokeAlpha;

  void main() {
    data = position; 
    float thres = 3.0;
    if (position.x > -60.0 && position.x < 60.0){
      strokeAlpha = 0.0;
    }else{
      strokeAlpha = 1.0;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
  }
`;
}

function fragment() {
  return `
  uniform vec3 colorA; 
  uniform vec3 colorB; 
  uniform float width;
  uniform float alpha;
  varying vec3 data;
  varying float strokeAlpha;

  void main() {
    //gl_FragColor = vec4((data.x+100.0)/200.0, (data.y+100.0)/200.0, 1, gl_FragCoord.y);
    gl_FragColor = vec4(strokeAlpha, 0, 0, 0.5);
  }
`;
}
