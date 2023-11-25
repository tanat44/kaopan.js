import { Engine } from "../../Engine/Engine";
// @ts-ignore
import { InteractionHandler } from "../InteractionHandler";
import { MouseRay } from "../MouseRay";
import { Drag } from "./Drag";
import { Hover } from "./Hover";
import { SelectRectangle } from "./SelectRectangle";

const LEFT_BUTTON = 1;

enum Mode {
  Drag,
  Highlight,
  SelectRectangle,
}

export class Select extends InteractionHandler {
  mouseRay: MouseRay;

  drag: Drag;
  hover: Hover;
  selectRectangle: SelectRectangle;

  constructor(engine: Engine) {
    super(engine);
    this.engine = engine;
    this.mouseRay = new MouseRay(engine);
    this.drag = new Drag(engine);
    this.hover = new Hover(engine);
    this.selectRectangle = new SelectRectangle(engine);
  }

  onMouseDown(e: MouseEvent) {
    if (e.buttons !== LEFT_BUTTON) return;

    const intersection = this.mouseRay.findIntersection(e);
    if (intersection.count) {
      this.drag.onMouseDown(e);
    } else {
      // this.selectRectangle.onMouseDown(e);
    }
  }

  onMouseMove(e: MouseEvent) {
    this.hover.onMouseMove(e);

    if (e.buttons === LEFT_BUTTON) {
      if (this.drag.dragging) this.drag.onMouseMove(e);
      // else this.selectRectangle.onMouseMove(e);
    }
  }

  onMouseUp(e: MouseEvent) {
    if (e.buttons !== LEFT_BUTTON) this.hover.cleanup();
    else {
      if (this.drag.dragging) this.drag.onMouseUp(e);
      // else this.selectRectangle.cleanup(e);
    }
  }
}