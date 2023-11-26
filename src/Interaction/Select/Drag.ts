import { Vector3 } from "three";
import { Engine } from "../../Engine/Engine";
// @ts-ignore
import { InteractionHandler } from "../InteractionHandler";
import { MouseRay } from "../MouseRay";
import { Selection } from "./Selection";

export class Drag extends InteractionHandler {
  mouseRay: MouseRay;
  selection: Selection;

  mouseDownPosition: Vector3;

  constructor(engine: Engine, mouseRay: MouseRay, selection: Selection) {
    super(engine);
    this.mouseRay = mouseRay;
    this.selection = selection;
    this.mouseDownPosition = new Vector3();
  }

  onMouseDown(e: MouseEvent): void {
    const intersection = this.mouseRay.findIntersection(e);
    this.mouseDownPosition.copy(intersection.point);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.selection || this.selection?.count === 0) return;
    const newPoint = this.mouseRay.findPlaneIntersection(
      e,
      this.mouseDownPosition.y
    );
    const delta = newPoint.sub(this.mouseDownPosition);
    delta.y = 0; // constraint move on XZ plane
    this.selection.move(delta);
  }
}
