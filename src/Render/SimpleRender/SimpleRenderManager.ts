import { Box3, Matrix4, Object3D, Vector3 } from "three";
import { RenderObject, RenderType, name } from "../../Data/types";
import { Engine } from "../../Engine/Engine";
import { IRenderManager } from "../IRenderManager";
import { SimpleBoxRender } from "./SimpleBoxRender";
import { SimpleRenderBase } from "./SimpleRenderBase";
import { SimpleSphereRender } from "./SimpleSphereRender";

type ObjectReference = {
  type: RenderType;
  mesh: Object3D;
};

export class SimpleRenderManager implements IRenderManager {
  engine: Engine;
  allObjects: Map<name, ObjectReference>;

  renders: SimpleRenderBase[];

  constructor(engine: Engine) {
    this.engine = engine;
    this.allObjects = new Map();
    this.renders = [
      new SimpleBoxRender(engine),
      new SimpleSphereRender(engine),
    ];
  }

  updateObject(objects: RenderObject[]) {
    for (const object of objects) {
      // create object
      const render = this.getRender(object.type);
      if (!this.allObjects.has(object.name)) {
        const mesh = render.create(object);
        const ref = {
          type: object.type,
          mesh: mesh,
        };
        this.allObjects.set(object.name, ref);
        this.engine.sceneManager.addObject(mesh, true);
      } else {
        // update object
        const ref = this.allObjects.get(object.name);
        render.update(object, ref.mesh);
      }
    }
  }

  remove(objectNames: string[]) {
    for (const name of objectNames) {
      const ref = this.allObjects.get(name);
      if (ref?.mesh) {
        this.allObjects.delete(name);
        this.engine.sceneManager.removeObject(ref.mesh);
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

  getRender(type: RenderType): SimpleRenderBase {
    const render = this.renders.find((render) => render.type === type);
    return render;
  }

  getIntersectObjects(box: Box3): name[] {
    return [];
  }
}
