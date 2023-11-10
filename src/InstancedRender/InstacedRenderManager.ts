import { RenderObject, RenderType, name } from "../Data/types";
import { Engine } from "../Engine/Engine";
import { InstancedBoxRender } from "./InstancedBoxRender";

export class InstancedRenderManager {
  engine: Engine;
  instancedBoxRenderer: InstancedBoxRender;

  constructor(engine: Engine) {
    this.engine = engine;
    this.instancedBoxRenderer = new InstancedBoxRender(engine);
  }

  updateObject(objects: RenderObject[]) {
    for (const object of objects) {
      // create object
      if (object.type === RenderType.Box) {
        this.instancedBoxRenderer.render(object);
      }
    }
    this.engine.render();
  }

  remove(objectNames: name[]) {
    for (const name of objectNames) {
      const type = this.getObjectType(name);
      if (type === RenderType.Box) this.instancedBoxRenderer.remove(name);
    }
  }

  getObjectType(name: name): RenderType {
    if (this.instancedBoxRenderer.allObjects.has(name)) return RenderType.Box;
    return RenderType.Unknown;
  }
}
