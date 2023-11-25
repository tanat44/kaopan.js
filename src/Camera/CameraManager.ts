import { Vector3 } from "three";
import { Engine } from "../Engine/Engine";
import { OrthographicController } from "./OrthographicController";
import { PerspectiveController } from "./PerspectiveController";
import { CameraType } from "./types";

export const INITIAL_CAMERA_POSITION = new Vector3(0, 3000, 2000);

export const NEAR = 0.1;
export const FAR = 999999;

export class CameraManager {
  engine: Engine;
  currentType: CameraType;

  // actual camera
  perspective: PerspectiveController;
  orthographic: OrthographicController;

  constructor(engine: Engine, initialCamera: CameraType) {
    this.engine = engine;
    this.perspective = new PerspectiveController();
    this.orthographic = new OrthographicController(engine);
    this.changeCamera(initialCamera);
    this.onResize(this.engine.width, this.engine.height);
  }

  setupPerspectiveCamera() {}

  onResize(width: number, height: number) {
    this.currentController.onResize(width, height);
    this.currentCamera.updateProjectionMatrix();
  }

  changeCamera(newType: CameraType) {
    const prevType = this.currentType;
    const oldCamera = this.currentCamera;
    this.currentType = newType;
    const newCamera = this.currentCamera;
    this.currentController.onChange(prevType, newType);

    if (this.currentCamera !== newCamera) {
      this.engine.sceneManager.removeObject(oldCamera);
      this.engine.sceneManager.addObject(newCamera, false);
    }
    this.engine?.interaction?.onCameraChange(this.currentCamera);
  }

  get currentController() {
    switch (this.currentType) {
      case CameraType.Orthographic:
      case CameraType.TopView:
        return this.orthographic;
      case CameraType.Perspective:
      default:
        return this.perspective;
    }
  }

  get currentCamera() {
    return this.currentController.camera;
  }
}
