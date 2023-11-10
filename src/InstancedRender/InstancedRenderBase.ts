import {
  BufferGeometry,
  Color,
  Euler,
  InstancedMesh,
  Matrix4,
  Vector3,
} from "three";
import { Engine } from "../Engine/Engine";
import { RenderObject, name } from "../Data/types";
import { DEG2RAD } from "three/src/math/MathUtils";

export const RENDER_SCALE = 1;
export const MAX_OBJECTS_IN_INSTANCE = 10000;

export type MeshIndex = {
  mesh: InstancedMesh;
  index: number;
};

export abstract class InstancedRenderBase {
  engine: Engine;
  instancedMeshes: InstancedMesh[];
  lastIndex: number;
  allObjects: Map<name, MeshIndex>;
  geometry: BufferGeometry;

  constructor(engine: Engine) {
    this.engine = engine;
    this.instancedMeshes = [];
    this.lastIndex = -1;
    this.allObjects = new Map();
    this.geometry = null;
  }

  render(object: RenderObject) {
    let meshIndex = this.allObjects.get(object.name);
    if (!meshIndex) {
      meshIndex = this.createMesh();
    }
    this.update(object, meshIndex);
  }

  createMesh(): MeshIndex {
    ++this.lastIndex;
    if (this.lastIndex >= MAX_OBJECTS_IN_INSTANCE) {
      this.addInstancedMesh();
      this.lastIndex = -1;
    }
    return {
      mesh: this.instancedMeshes[this.instancedMeshes.length - 1],
      index: this.lastIndex,
    };
  }

  remove(name: name) {
    const meshIndex = this.allObjects.get(name);
    if (!meshIndex) return;

    const object: RenderObject = {
      name,
      scale: new Vector3(0, 0, 0),
    };
    const matrix = new Matrix4();
    this.applyScale(object, matrix);
    meshIndex.mesh.setMatrixAt(meshIndex.index, matrix);
    meshIndex.mesh.instanceMatrix.needsUpdate = true;
  }

  update(object: RenderObject, meshIndex: MeshIndex) {
    // transformation
    const matrix = new Matrix4();
    this.applyPosition(object, matrix);
    this.applyRotation(object, matrix);
    this.applyScale(object, matrix);
    meshIndex.mesh.setMatrixAt(meshIndex.index, matrix);
    meshIndex.mesh.instanceMatrix.needsUpdate = true;

    // color
    this.applyColor(object, meshIndex);
  }

  applyPosition(object: RenderObject, matrix: Matrix4) {
    if (!object.position) return;
    const m = new Matrix4();
    m.setPosition(object.position.multiplyScalar(RENDER_SCALE));
    matrix.multiply(m);
  }

  applyRotation(object: RenderObject, matrix: Matrix4) {
    if (!object.rotation) return;
    const m = new Matrix4();
    m.makeRotationFromEuler(
      new Euler(
        object.rotation.x * DEG2RAD,
        object.rotation.y * DEG2RAD,
        object.rotation.z * DEG2RAD
      )
    );
    matrix.multiply(m);
  }

  applyScale(object: RenderObject, matrix: Matrix4) {
    if (!object.scale) return;
    const s = object.scale.clone().multiplyScalar(RENDER_SCALE);
    const m = new Matrix4();
    m.makeScale(s.x, s.y, s.z);
    matrix.multiply(m);
  }

  applyColor(object: RenderObject, meshIndex: MeshIndex) {
    if (!object.color) return;
    meshIndex.mesh.setColorAt(meshIndex.index, new Color(object.color));
    meshIndex.mesh.instanceColor.needsUpdate = true;
  }

  protected addInstancedMesh() {
    const mesh = new InstancedMesh(
      this.geometry,
      this.engine.assets.meshBasicMaterialLibrary.getMaterial(),
      MAX_OBJECTS_IN_INSTANCE
    );
    this.instancedMeshes.push(mesh);
    this.engine.scene.add(mesh);
  }
}
