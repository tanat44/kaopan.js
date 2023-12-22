import { Euler, Matrix4, PlaneGeometry } from "three";
import { DEG2RAD } from "three/src/math/MathUtils";
import { RenderObject, RenderType } from "../../Data/types";
import { Engine } from "../../Engine/Engine";
import { InstancedRenderBase } from "./InstancedRenderBase";

export class InstancedRectangleRender extends InstancedRenderBase {
  constructor(engine: Engine) {
    super(engine);
    this.geometry = new PlaneGeometry(1, 1);
    this.geometry.rotateX(-Math.PI / 2);
    this.type = RenderType.Rectangle;
    this.addInstancedMesh();
  }

  override applyScale(object: RenderObject, matrix: Matrix4) {
    if (!object.scale) return;
    const newScale = object.scale.clone();
    newScale.y = 1;
    const m = new Matrix4();
    m.makeScale(newScale.x, newScale.y, newScale.z);
    matrix.multiply(m);
  }

  override applyRotation(object: RenderObject, matrix: Matrix4) {
    if (!object.rotation) return;
    const m = new Matrix4();
    m.makeRotationFromEuler(
      new Euler(
        (object.rotation.x - 90) * DEG2RAD,
        object.rotation.y * DEG2RAD,
        object.rotation.z * DEG2RAD
      )
    );
    matrix.multiply(m);
  }
}
