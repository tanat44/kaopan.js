import { BufferAttribute, BufferGeometry } from "three";

export class LineGeometry extends BufferGeometry {
  constructor() {
    super();
    const vertices = new Float32Array([
      0, // v0
      -0.5,
      0,
      0, // v1
      0.5,
      0,
      1, // v2
      0.5,
      0,
      1, // v3
      0.5,
      0,
      1, // v4
      -0.5,
      0,
      0, // v5
      -0.5,
      0,
    ]);
    this.setAttribute("position", new BufferAttribute(vertices, 3));
  }
}
