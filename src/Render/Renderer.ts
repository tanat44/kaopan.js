import {
  BufferGeometry,
  InstancedMesh,
  Matrix4,
  Object3D,
  Vector3,
} from "three";
import { RenderObject, name } from "../Data/types";
import { Engine } from "../Engine/Engine";
import { IRenderManager } from "./IRenderManager";
import { InstancedRenderManager } from "./InstancedRender/InstancedRenderManager";
import { SimpleRenderManager } from "./SimpleRender/SimpleRenderManager";

export class RenderManager {
  engine: Engine;
  simpleRenderManager: SimpleRenderManager;
  instancedRenderManager: InstancedRenderManager;

  constructor(engine: Engine) {
    this.engine = engine;
    this.simpleRenderManager = new SimpleRenderManager(engine);
    this.instancedRenderManager = new InstancedRenderManager(engine);
  }

  findRenderManager(name: name): IRenderManager {
    if (this.simpleRenderManager.hasObject(name))
      return this.simpleRenderManager;
    if (this.instancedRenderManager.hasObject(name))
      return this.instancedRenderManager;

    return null;
  }

  updatePosition(name: name, newPosition: Vector3) {
    const manager = this.findRenderManager(name);
    if (!manager) return;
    manager.updatePosition(name, newPosition);
  }

  updateObject(objects: RenderObject[]) {
    const simpleObjects: RenderObject[] = [];
    const gpuObjects: RenderObject[] = [];
    for (const object of objects) {
      if (object?.gpuInstancing) {
        gpuObjects.push(object);
      } else {
        simpleObjects.push(object);
      }
    }
    // this.simpleRenderManager.updateObject(simpleObjects);
    this.instancedRenderManager.updateObject(gpuObjects, null);
  }

  getGlobalPosition(name: name): Vector3 {
    const manager = this.findRenderManager(name);
    if (!manager) return null;

    return manager.getGlobalPosition(name);
  }

  findObjectName(object: Object3D, instanceId: number): name {
    if ((object as InstancedMesh)?.isInstancedMesh)
      return this.instancedRenderManager.findObjectName(object, instanceId);
    return object.name;
  }

  getMatrix(name: name): Matrix4 {
    const manager = this.findRenderManager(name);
    if (!manager) return null;

    return manager.getMatrix(name);
  }
}
