import { BufferAttribute, BufferGeometry } from "three";

export class StrokeGeometry extends BufferGeometry {
  constructor() {
    super();
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
    this.setAttribute("position", new BufferAttribute(vertices, 3));
  }
}
