import { Engine } from "./Engine/Engine";

export class Ui {
  engine: Engine;

  constructor() {
    this.engine = new Engine("canvas");
    this.initControl();
  }

  initControl() {
    document.getElementById("zoomFitButton").addEventListener("click", () => {
      this.engine.zoomFit();
    });

    document.getElementById("clearButton").addEventListener("click", () => {
      this.engine.clear();
    });
  }
}
