import { CameraType } from "./Camera/types";
import { Engine } from "./Engine/Engine";

export class Ui {
  engine: Engine;

  constructor() {
    this.engine = new Engine("canvas");
    this.initControl();
  }

  initControl() {
    document.getElementById("orthographic").addEventListener("click", () => {
      this.engine.cameraManager.changeCamera(CameraType.Orthographic);
    });
    document.getElementById("perspective").addEventListener("click", () => {
      this.engine.cameraManager.changeCamera(CameraType.Perspective);
    });
    document.getElementById("topview").addEventListener("click", () => {
      this.engine.cameraManager.changeCamera(CameraType.TopView);
    });
  }
}
