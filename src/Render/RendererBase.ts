import { BufferGeometry, Euler, InstancedMesh, Mesh, Object3D } from "three";
import { Engine } from "../Engine/Engine";
import { RenderObject } from "../Data/types";
import { DEG2RAD } from "three/src/math/MathUtils";

export const RENDER_SCALE = 1;

export abstract class RendererBase {
  instancedMeshes: InstancedMesh[];
  geometry: BufferGeometry;
  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
    this.instancedMeshes = [];
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
    mesh.position.copy(object.position.multiplyScalar(RENDER_SCALE));
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
    mesh.scale.copy(object.scale.multiplyScalar(RENDER_SCALE));
  }
}
