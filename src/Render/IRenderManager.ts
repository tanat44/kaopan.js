import { Object3D, Vector3 } from "three";
import { RenderObject, name } from "../Data/types";

export interface IRenderManager {
  updateObject(objects: RenderObject[], parentName: name): void;
  hasObject(name: name): boolean;
  findObjectName(object: Object3D, instanceId: number): name;
  getGlobalPosition(name: name): Vector3;
  updatePosition(name: name, newPosition: Vector3): void;
}
