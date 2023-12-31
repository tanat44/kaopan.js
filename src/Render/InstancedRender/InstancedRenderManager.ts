import { Box3, Matrix4, Object3D, Vector3 } from "three";
import { RenderObject, RenderType, name } from "../../Data/types";
import { Engine } from "../../Engine/Engine";
import { IRenderManager } from "../IRenderManager";
import { InstancedArrowRender } from "./InstancedArrowRender";
import { InstancedBoxRender } from "./InstancedBoxRender";
import { InstancedLineRender } from "./InstancedLineRender";
import { InstancedRectangleRender } from "./InstancedRectangleRender";
import { InstancedRenderBase } from "./InstancedRenderBase";
import { InstancedSphereRenderer } from "./InstancedSphereRender";
import { InstancedStrokeRender } from "./InstancedStrokeRender";

type InstancedObject = {
  type: RenderType;
  position: Vector3;
  parentName: name;
  childrenName: name[];
};
export class InstancedRenderManager implements IRenderManager {
  engine: Engine;
  instancedRenders: Map<RenderType, InstancedRenderBase>;
  instancedObjects: Map<name, InstancedObject>;

  constructor(engine: Engine) {
    this.engine = engine;
    this.instancedRenders = new Map();
    this.instancedRenders.set(RenderType.Box, new InstancedBoxRender(engine));
    this.instancedRenders.set(
      RenderType.Sphere,
      new InstancedSphereRenderer(engine)
    );
    this.instancedRenders.set(
      RenderType.Rectangle,
      new InstancedRectangleRender(engine)
    );
    this.instancedRenders.set(
      RenderType.Stroke,
      new InstancedStrokeRender(engine)
    );
    this.instancedRenders.set(RenderType.Line, new InstancedLineRender(engine));
    this.instancedRenders.set(
      RenderType.Arrow,
      new InstancedArrowRender(engine)
    );

    // data
    this.instancedObjects = new Map();
  }

  private recursiveUpdateObject(objects: RenderObject[], parentName: name) {
    if (!objects || objects.length === 0) return;
    for (const object of objects) {
      // console.log("update", object.name, "parent", parentName);
      const parentMatrix = new Matrix4();
      this.getParentMatrix(parentName, parentMatrix);

      const renderer = this.getInstanceRender(object.type);
      if (renderer !== null) renderer.render(object, parentMatrix);
      const childrenName: name[] = object.children
        ? object.children.map((child) => child.name)
        : [];
      const instancedObject: InstancedObject = {
        type: object.type,
        position: object.position,
        parentName,
        childrenName,
      };
      this.instancedObjects.set(object.name, instancedObject);
      this.recursiveUpdateObject(object.children, object.name);
    }
  }

  updateObject(objects: RenderObject[], parentName: name) {
    this.recursiveUpdateObject(objects, parentName);
  }

  remove(objectNames: name[]) {
    for (const name of objectNames) {
      const type = this.getObjectType(name);
      const renderer = this.getInstanceRender(type);
      if (renderer !== null) renderer.remove(name);
    }
  }

  getObjectType(name: name): RenderType {
    const instancedObject = this.instancedObjects.get(name);
    if (!instancedObject) return RenderType.Unknown;
    return instancedObject.type;
  }

  getInstanceRender(type: RenderType): InstancedRenderBase {
    return this.instancedRenders.get(type);
  }

  getParentMatrix(name: name, matrix: Matrix4) {
    const instancedObject: InstancedObject = this.instancedObjects.get(name);
    if (!instancedObject) return new Matrix4();

    const parentMatrix = new Matrix4();
    if (instancedObject.parentName)
      this.getParentMatrix(instancedObject.parentName, parentMatrix);
    matrix.setPosition(instancedObject.position);
    matrix.multiply(parentMatrix);
  }

  updatePosition(name: name, newPosition: Vector3) {
    const instancedObject = this.instancedObjects.get(name);
    if (!instancedObject) return;
    const renderer = this.getInstanceRender(instancedObject.type);

    // parent
    const parentMatrix = new Matrix4();
    this.getParentMatrix(instancedObject.parentName, parentMatrix);
    const parentPosition = new Vector3();
    parentPosition.setFromMatrixPosition(parentMatrix);

    // this position
    const thisPosition = newPosition.clone().sub(parentPosition);
    instancedObject.position.copy(thisPosition);

    // update mesh
    const matrix = renderer.getMatrix(name);
    const instanceRef = renderer.allObjects.get(name);
    matrix.setPosition(newPosition);
    instanceRef.mesh.setMatrixAt(instanceRef.index, matrix);
    instanceRef.mesh.instanceMatrix.needsUpdate = true;

    // update children
    for (const child of instancedObject.childrenName) {
      const childObject = this.instancedObjects.get(child);
      const childNewPosition = newPosition.clone().add(childObject.position);
      this.updatePosition(child, childNewPosition);
    }
  }

  findObjectName(object: Object3D, instanceId: number): name {
    let render: InstancedRenderBase = null;
    for (let [key, r] of this.instancedRenders.entries()) {
      if (r.hasObject(object)) {
        render = r;
        break;
      }
    }
    if (!render) return null;
    return render.getObjectName(object, instanceId);
  }

  hasObject(name: name): boolean {
    return this.instancedObjects.has(name);
  }

  getGlobalPosition(name: name): Vector3 {
    const matrix = this.getMatrix(name);
    const pos = new Vector3();
    pos.setFromMatrixPosition(matrix);
    return pos;
  }

  getMatrix(name: string): Matrix4 {
    const instancedObject = this.instancedObjects.get(name);
    if (!instancedObject) return null;

    const render = this.getInstanceRender(instancedObject.type);
    const matrix = render.getMatrix(name);
    return matrix;
  }

  getIntersectObjects(box: Box3): name[] {
    const objectNames: name[] = [];
    this.instancedRenders.forEach((render, type) => {
      const names = render.getIntersectObjects(box);
      objectNames.push(...names);
    });
    return objectNames;
  }
}
