import { BufferGeometry, Euler, Object3D } from "three";
import { DEG2RAD } from "three/src/math/MathUtils";
import { RenderObject, RenderType } from "../../Data/types";
import { Engine } from "../../Engine/Engine";

export abstract class SimpleRenderBase {
  geometry: BufferGeometry;
  engine: Engine;
  type: RenderType;

  constructor(engine: Engine) {
    this.engine = engine;
    this.type = RenderType.Unknown;
  }

  create(object: RenderObject): Object3D {
    return null;
  }

  update(object: RenderObject, mesh: Object3D) {
    this.applyPosition(object, mesh);
    this.applyRotation(object, mesh);
    this.applyScale(object, mesh);
  }

  applyPosition(object: RenderObject, mesh: Object3D) {
    if (!object.position) return;
    mesh.position.copy(object.position);
  }

  applyRotation(object: RenderObject, mesh: Object3D) {
    if (!object.rotation) return;
    mesh.setRotationFromEuler(
      new Euler(
        object.rotation.x * DEG2RAD,
        object.rotation.y * DEG2RAD,
        object.rotation.z * DEG2RAD
      )
    );
  }

  applyScale(object: RenderObject, mesh: Object3D) {
    if (!object.scale) return;
    mesh.scale.copy(object.scale);
  }
}
