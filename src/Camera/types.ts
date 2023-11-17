import { Euler, Vector3 } from "three";

export enum CameraType {
  Perspective,
  Orthographic,
  TopView,
}

export type CameraPose = {
  position: Vector3;
  rotation: Euler;
};
