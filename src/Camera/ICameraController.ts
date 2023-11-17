import { OrthographicCamera, PerspectiveCamera } from "three";
import { CameraType } from "./types";

export interface ICameraController {
  setup(): void;
  onResize(width: number, height: number): void;
  onChange(prevType: CameraType, newType: CameraType): void;
  get camera(): OrthographicCamera | PerspectiveCamera;
}
