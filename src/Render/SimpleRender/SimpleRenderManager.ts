import { Matrix4, Object3D, Object3DEventMap, Vector3 } from "three";
import { RenderObject, RenderType, name } from "../../Data/types";
import { Engine } from "../../Engine/Engine";
import { SimpleBoxRender } from "./SimpleBoxRender";
import { IRenderManager } from "../IRenderManager";

type ObjectReference = {
  type: RenderType;
  mesh: Object3D;
};

export class SimpleRenderManager implements IRenderManager {
  engine: Engine;
  allObjects: Map<name, ObjectReference>;

  boxRenderer: SimpleBoxRender;

  constructor(engine: Engine) {
    this.engine = engine;
    this.allObjects = new Map();
    this.boxRenderer = new SimpleBoxRender(engine);
  }

  updateObject(objects: RenderObject[]) {
    for (const object of objects) {
      // create object
      if (!this.allObjects.has(object.name)) {
        if (object.type === RenderType.Box) {
          const mesh = this.boxRenderer.create(object);
          const ref = {
            type: object.type,
            mesh: mesh,
          };
          this.allObjects.set(object.name, ref);
          this.engine.scene.add(mesh);
        }
      } else {
        // update object
        const ref = this.allObjects.get(object.name);
        if (ref.type === RenderType.Box) {
          this.boxRenderer.update(object, ref.mesh);
        }
      }
    }
    this.engine.render();
  }

  remove(objectNames: string[]) {
    for (const name of objectNames) {
      const ref = this.allObjects.get(name);
      if (ref?.mesh) {
        this.allObjects.delete(name);
        this.engine.scene.remove(ref.mesh);
      }
    }
  }

  updatePosition(name: name, newPosition: Vector3) {
    const mesh = this.allObjects.get(name);
    if (!mesh) return;
    mesh.mesh.position.copy(newPosition);
  }

  hasObject(name: string): boolean {
    return this.allObjects.has(name);
  }

  findObjectName(object: Object3D, instanceId: number): string {
    return object.name;
  }

  getGlobalPosition(name: string): Vector3 {
    const objectRef = this.allObjects.get(name);
    if (!objectRef) return null;

    const position = new Vector3();
    objectRef.mesh.getWorldPosition(position);
    return position;
  }

  getMatrix(name: string): Matrix4 {
    const objectRef = this.allObjects.get(name);
    if (!objectRef) return null;
    return objectRef.mesh.matrix;
  }
}
