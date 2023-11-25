import { Vector3 } from "three";
import { Engine } from "../../Engine/Engine";
// @ts-ignore
import { name } from "../../Data/types";
import { InteractionHandler } from "../InteractionHandler";
import { MouseRay } from "../MouseRay";

export class Drag extends InteractionHandler {
  mouseRay: MouseRay;

  clickPosition: Vector3;
  objectOriginalPosition: Vector3;
  draggingObjectName: name;

  constructor(engine: Engine) {
    super(engine);
    this.mouseRay = new MouseRay(engine);
    this.objectOriginalPosition = new Vector3();
    this.clickPosition = new Vector3();
  }

  onMouseDown(e: MouseEvent) {
    const intersection = this.mouseRay.findIntersection(e);
    const objectName = this.engine.renderer.findObjectName(
      intersection.object,
      intersection.instanceId
    );
    if (!objectName) return;
    this.draggingObjectName = objectName;
    this.objectOriginalPosition = this.engine.renderer.getGlobalPosition(
      this.draggingObjectName
    );
    this.clickPosition = this.mouseRay.findPlaneIntersection(
      e,
      this.objectOriginalPosition.y
    );
    console.log("clicked:", this.draggingObjectName);
    this.engine.transformer.setTransformObject(
      objectName,
      this.engine.renderer.getMatrix(objectName)
    );
  }

  onMouseMove(e: MouseEvent) {
    if (!this.draggingObjectName) return;
    const intersection = this.mouseRay.findPlaneIntersection(
      e,
      this.objectOriginalPosition.y
    );
    intersection.sub(this.clickPosition).add(this.objectOriginalPosition);
    this.engine.renderer.updatePosition(this.draggingObjectName, intersection);
  }

  onMouseUp(e: MouseEvent) {
    this.draggingObjectName = null;
  }

  get dragging() {
    return !!this.draggingObjectName;
  }
}
