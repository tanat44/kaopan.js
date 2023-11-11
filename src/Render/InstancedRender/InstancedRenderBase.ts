import {
  BufferGeometry,
  Color,
  Euler,
  InstancedMesh,
  Matrix4,
  Object3D,
  Vector3,
} from "three";
import { Engine } from "../../Engine/Engine";
import { RenderObject, RenderType, name } from "../../Data/types";
import { DEG2RAD } from "three/src/math/MathUtils";

export const RENDER_SCALE = 1;
export const MAX_OBJECTS_IN_INSTANCE = 10000;
export const FIRST_INDEX = 0;

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
  type: RenderType;

  constructor(engine: Engine) {
    this.engine = engine;
    this.instancedMeshes = [];
    this.lastIndex = FIRST_INDEX;
    this.allObjects = new Map();
    this.geometry = null;
    this.type = RenderType.Unknown;
  }

  render(object: RenderObject, parentMatrix: Matrix4) {
    let meshIndex = this.allObjects.get(object.name);
    if (!meshIndex) {
      meshIndex = this.createMesh();
      this.allObjects.set(object.name, meshIndex);
    }
    this.update(object, meshIndex, parentMatrix);
  }

  createMesh(): MeshIndex {
    ++this.lastIndex;
    if (this.lastIndex >= MAX_OBJECTS_IN_INSTANCE) {
      this.addInstancedMesh();
      this.lastIndex = FIRST_INDEX;
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
    this.allObjects.delete(name);
  }

  update(object: RenderObject, meshIndex: MeshIndex, parentMatrix: Matrix4) {
    // transformation
    const matrix = new Matrix4();
    matrix.copy(parentMatrix);
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

  getMatrix(name: name) {
    const meshIndex = this.allObjects.get(name);
    const matrix = new Matrix4();
    if (!meshIndex) return matrix;

    meshIndex.mesh.getMatrixAt(meshIndex.index, matrix);
    return matrix;
  }

  hasObject(object: Object3D): boolean {
    return !!this.instancedMeshes.find((mesh) => mesh === object);
  }

  getObjectName(object: Object3D, instanceId: number): name {
    for (let [key, value] of this.allObjects) {
      const meshIndex = value as MeshIndex;
      if (meshIndex.mesh === object && meshIndex.index === instanceId)
        return key;
    }
    return null;
  }
}
