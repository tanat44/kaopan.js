import { Quaternion, Vector3 } from "three";

export type Pose = {
  position: Vector3;
  rotation: Quaternion;
};
