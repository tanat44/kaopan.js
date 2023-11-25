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

  drag: Drag;
  hover: Hover;
  selectRectangle: SelectRectangle;
  selection: Selection;

  constructor(engine: Engine) {
    super(engine);
    this.engine = engine;
    this.mouseRay = new MouseRay(engine);
    this.drag = new Drag(engine);
    this.hover = new Hover(engine);
    this.selectRectangle = new SelectRectangle(engine);
    this.selection = new Selection(engine);
  }

  onMouseDown(e: MouseEvent) {
    if (e.button !== LEFT_BUTTON) return;

    const intersection = this.mouseRay.findIntersection(e);
    if (intersection.count) {
      this.drag.onMouseDown(e);
    } else {
      this.selectRectangle.onMouseDown(e);
      this.selection.deselect();
    }
  }

  onMouseMove(e: MouseEvent) {
    this.hover.onMouseMove(e);

    if (e.button === LEFT_BUTTON && e.buttons === 1) {
      if (this.drag.dragging) this.drag.onMouseMove(e);
      else this.selectRectangle.onMouseMove(e);
    }
  }

  onMouseUp(e: MouseEvent) {
    if (e.button !== LEFT_BUTTON) return;
    if (this.drag.dragging) this.drag.onMouseUp(e);
    else {
      this.selectRectangle.onMouseUp(e);
      const names = [];
      for (let i = 0; i < 100; ++i) {
        names.push(`tree_${Math.round(Math.random() * 1000)}`);
      }
      this.selection.select(names);
    }
  }
}
