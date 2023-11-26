import { Engine } from "../../Engine/Engine";
// @ts-ignore
import { InteractionHandler } from "../InteractionHandler";
import { MouseRay } from "../MouseRay";
import { Drag } from "./Drag";
import { Hover } from "./Hover";
import { SelectRectangle } from "./SelectRectangle";
import { Selection } from "./Selection";

const LEFT_BUTTON = 0;

enum Mode {
  Drag,
  Highlight,
  SelectRectangle,
}

export class Select extends InteractionHandler {
  mouseRay: MouseRay;

  hover: Hover;
  selectRectangle: SelectRectangle;
  selection: Selection;
  drag: Drag;

  constructor(engine: Engine) {
    super(engine);
    this.engine = engine;
    this.mouseRay = new MouseRay(engine);
    this.hover = new Hover(engine, this.mouseRay);
    this.selectRectangle = new SelectRectangle(engine, this.mouseRay);
    this.selection = new Selection(engine, this.mouseRay);
    this.drag = new Drag(engine, this.mouseRay, this.selection);
  }

  onMouseDown(e: MouseEvent) {
    if (e.button !== LEFT_BUTTON) return;

    const intersection = this.mouseRay.findIntersection(e);
    if (intersection.count) {
      const objectName = this.engine.renderer.findObjectName(
        intersection.object,
        intersection.instanceId
      );
      if (this.selection.count === 0) this.selection.select([objectName]);
      this.drag.onMouseDown(e);
    } else {
      this.selectRectangle.onMouseDown(e);
      this.selection.deselect();
    }
  }

  onMouseMove(e: MouseEvent) {
    this.hover.onMouseMove(e);

    if (e.button === LEFT_BUTTON && e.buttons === 1) {
      if (this.selection.count) this.drag.onMouseMove(e);
      else this.selectRectangle.onMouseMove(e);
    }
  }

  onMouseUp(e: MouseEvent) {
    if (e.button !== LEFT_BUTTON) return;

    this.selectRectangle.onMouseUp(e);
    const names = this.selectRectangle.getObjectNames();
    this.selection.select(names);
  }
}
