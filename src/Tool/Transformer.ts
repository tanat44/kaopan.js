import { Vector3, BufferGeometry, Line, Matrix4, Quaternion } from "three";
import { Engine } from "../Engine/Engine";
import { name } from "../Data/types";

export class Transformer {
  engine: Engine;

  geometry: BufferGeometry;
  object: Line;

  constructor(engine: Engine) {
    this.engine = engine;
    this.createObject();
  }

  createObject() {
    this.geometry = new BufferGeometry();
    this.object = new Line(
      this.geometry,
      this.engine.materials.lineBasicMaterialLibrary.getMaterial("#0062ff")
    );
    this.engine.scene.add(this.object);
  }

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
      .sub(new Vector3(-halfScale.x, newHeight, halfScale.z));
    const br = center
      .clone()
      .sub(new Vector3(halfScale.x, newHeight, halfScale.z));
    this.geometry.setFromPoints([tl, tr, bl, br]);
  }
}
