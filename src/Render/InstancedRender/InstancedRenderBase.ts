import {
  BufferGeometry,
  Color,
  Euler,
  InstancedMesh,
  Material,
  Matrix4,
  Object3D,
  Vector3,
} from "three";
import { DEG2RAD } from "three/src/math/MathUtils";
import { RenderObject, RenderType, name } from "../../Data/types";
import { Engine } from "../../Engine/Engine";

export const RENDER_SCALE = 1;
export const MAX_OBJECTS_IN_INSTANCE = 10000;
export const FIRST_INDEX = 0;

export type InstanceRef = {
  mesh: InstancedMesh;
  index: number;
};

export abstract class InstancedRenderBase {
  engine: Engine;
  instancedMeshes: InstancedMesh[];
  lastIndex: number;
  allObjects: Map<name, InstanceRef>;
  geometry: BufferGeometry;
  material: Material;
  type: RenderType;

  constructor(engine: Engine) {
    this.engine = engine;
    this.instancedMeshes = [];
    this.lastIndex = FIRST_INDEX;
    this.allObjects = new Map();
    this.geometry = null;
    this.material =
      this.engine.materials.meshBasicMaterialLibrary.getMaterial();
    this.type = RenderType.Unknown;
  }

  render(object: RenderObject, parentMatrix: Matrix4) {
    let instanceRef = this.allObjects.get(object.name);
    if (!instanceRef) {
      instanceRef = this.createMesh();
      this.allObjects.set(object.name, instanceRef);
    }
    this.update(object, instanceRef, parentMatrix);
  }

  private createMesh(): InstanceRef {
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
    const instanceRef = this.allObjects.get(name);
    if (!instanceRef) return;

    const object: RenderObject = {
      name,
      scale: new Vector3(0, 0, 0),
    };
    const matrix = new Matrix4();
    this.applyScale(object, matrix);
    instanceRef.mesh.setMatrixAt(instanceRef.index, matrix);
    instanceRef.mesh.instanceMatrix.needsUpdate = true;
    this.allObjects.delete(name);
  }

  update(
    object: RenderObject,
    instanceRef: InstanceRef,
    parentMatrix: Matrix4
  ) {
    // transformation
    const matrix = new Matrix4();
    matrix.copy(parentMatrix);
    this.applyPosition(object, matrix);
    this.applyRotation(object, matrix);
    this.applyScale(object, matrix);
    instanceRef.mesh.setMatrixAt(instanceRef.index, matrix);
    instanceRef.mesh.instanceMatrix.needsUpdate = true;

    // color
    this.applyColor(object, instanceRef);
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

  applyColor(object: RenderObject, instanceRef: InstanceRef) {
    if (!object.color) return;
    instanceRef.mesh.setColorAt(instanceRef.index, new Color(object.color));
    instanceRef.mesh.instanceColor.needsUpdate = true;
  }

  protected addInstancedMesh() {
    const mesh = new InstancedMesh(
      this.geometry,
      this.material,
      MAX_OBJECTS_IN_INSTANCE
    );
    this.instancedMeshes.push(mesh);
    this.engine.sceneManager.addObject(mesh, true);
  }

  getMatrix(name: name) {
    const instanceRef = this.allObjects.get(name);
    const matrix = new Matrix4();
    if (!instanceRef) return matrix;

    instanceRef.mesh.getMatrixAt(instanceRef.index, matrix);
    return matrix;
  }

  hasObject(object: Object3D): boolean {
    return !!this.instancedMeshes.find((mesh) => mesh === object);
  }

  getObjectName(object: Object3D, instanceId: number): name {
    for (let [key, value] of this.allObjects) {
      const instanceRef = value as InstanceRef;
      if (instanceRef.mesh === object && instanceRef.index === instanceId)
        return key;
    }
    return null;
  }
}
