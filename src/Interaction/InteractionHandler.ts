import { Engine } from "../Engine/Engine";

export abstract class InteractionHandler {
  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  onMouseDown(e: MouseEvent) {}

  onMouseMove(e: MouseEvent) {}

  onMouseUp(e: MouseEvent) {}

  cleanup() {}
}
