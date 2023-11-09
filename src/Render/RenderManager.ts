import { Mesh, Object3D } from "three";
import { RenderObject, RenderType } from "../Data/types";
import { Engine } from "../Engine/Engine";
import { BoxRenderer } from "./BoxRenderer";

type ObjectReference = {
  type: RenderType;
  mesh: Object3D;
};

export class RenderManager {
  engine: Engine;
  allObjects: Map<string, ObjectReference>;

  boxRenderer: BoxRenderer;

  constructor(engine: Engine) {
    this.engine = engine;
    this.allObjects = new Map();
    this.boxRenderer = new BoxRenderer(engine);
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
}
