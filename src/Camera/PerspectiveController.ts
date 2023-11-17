import { PerspectiveCamera, Vector3 } from "three";
import {
  CameraManager,
  FAR,
  INITIAL_CAMERA_POSITION,
  NEAR,
} from "./CameraManager";
import { ICameraController } from "./ICameraController";
import { CameraType } from "./types";

export class PerspectiveController implements ICameraController {
  perspectiveCamera: PerspectiveCamera;

  constructor() {
    this.setup();
  }

  setup() {
    this.perspectiveCamera = new PerspectiveCamera(70, 1, NEAR, FAR);
    this.perspectiveCamera.position.copy(INITIAL_CAMERA_POSITION);
    this.perspectiveCamera.lookAt(new Vector3(0, 0, 0));
  }

  onResize(width: number, height: number) {
    this.perspectiveCamera.aspect = width / height;
  }

  get camera() {
    return this.perspectiveCamera;
  }

  onChange(prevType: CameraType, newType: CameraType) {}
}
