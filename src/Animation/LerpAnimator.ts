import { Object3D, Quaternion, Vector3 } from "three";
import { Pose } from "./types";
import { Engine } from "../Engine/Engine";

export class LerpAnimator {
  engine: Engine;
  targetPose: Pose;
  startPose: Pose;
  object: Object3D;
  duration: number;
  time: number;

  constructor(engine: Engine, object: Object3D) {
    this.engine = engine;
    this.object = object;
  }

  animate(duration: number, targetPose: Pose) {
    this.time = 0;
    this.duration = duration;
    const rotation = new Quaternion();
    rotation.setFromEuler(this.object.rotation);
    this.startPose = {
      position: this.object.position.clone(),
      rotation,
    };
    this.targetPose = { ...targetPose };
  }

  tick(dt: number) {
    if (this.time > this.duration) {
      this.engine.removeAnimator(this.object.id.toString());
    }
    this.time += dt;
    const alpha = this.time / this.duration;

    // lerp position
    const newPos = new Vector3();
    newPos.lerpVectors(
      this.startPose.position,
      this.targetPose.position,
      alpha
    );
    this.object.position.copy(newPos);

    // lerp rotation
    const newRot = new Quaternion();
    newRot.slerpQuaternions(
      this.startPose.rotation,
      this.targetPose.rotation,
      alpha
    );
    this.object.rotation.setFromQuaternion(newRot);
  }
}
