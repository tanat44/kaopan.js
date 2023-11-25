import { Matrix4, Quaternion, Vector3 } from "three";
import { name } from "../Data/types";
import { Engine } from "../Engine/Engine";

export class Transformer {
  engine: Engine;

  // geometry: BufferGeometry;
  // line: MeshLine;

  constructor(engine: Engine) {
    this.engine = engine;
    this.createObject();
  }

  createObject() {}

  setTransformObject(name: name, matrix: Matrix4) {
    const center = new Vector3();
    const rotation = new Quaternion();
    const scale = new Vector3();
    matrix.decompose(center, rotation, scale);

    const halfScale = scale.clone().multiplyScalar(0.5);
    halfScale.y = 0;

    const newHeight = -10;
    const tl = center
      .clone()
      .sub(new Vector3(-halfScale.x, newHeight, -halfScale.z));
    const tr = center
      .clone()
      .sub(new Vector3(halfScale.x, newHeight, -halfScale.z));
    const bl = center
      .clone()
      .sub(new Vector3(halfScale.x, newHeight, halfScale.z));
    const br = center
      .clone()
      .sub(new Vector3(-halfScale.x, newHeight, halfScale.z));
    // this.geometry.setFromPoints([tl, tr, bl, br, tl]);
    // this.line.setGeometry(this.geometry);
    console.log("set transform");
  }
}
