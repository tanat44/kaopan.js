import { BufferAttribute, BufferGeometry } from "three";

const ARROW_WIDTH = 2;

export class ArrowGeometry extends BufferGeometry {
  constructor() {
    super();
    const vertices = new Float32Array([
      // line
      0, // v0
      -0.5,
      0,
      0, // v1
      0.5,
      0,
      0.5, // v2
      0.5,
      0,
      0.5, // v3
      0.5,
      0,
      0.5, // v4
      -0.5,
      0,
      0, // v5
      -0.5,
      0,
      // arrow head
      0.5, // v6
      ARROW_WIDTH * 0.5,
      0,
      1, // v7
      0,
      0,
      0.5, // v8
      -ARROW_WIDTH * 0.5,
      0,
    ]);
    this.setAttribute("position", new BufferAttribute(vertices, 3));

    // index describe function of the vertices
    // 0 = other points
    // 1 = wing
    const index = [0, 0, 0, 0, 0, 0, 1, 0, 1];
    this.setAttribute("index", new BufferAttribute(new Uint8Array(index), 1));
  }
}
