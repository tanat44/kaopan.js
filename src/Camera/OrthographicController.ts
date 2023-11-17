import { Euler, OrthographicCamera, Quaternion, Vector3 } from "three";
import { FAR, INITIAL_CAMERA_POSITION, NEAR } from "./CameraManager";
import { ICameraController } from "./ICameraController";
import { Pose } from "../Animation/types";
import { CameraType } from "./types";
import { LerpAnimator } from "../Animation/LerpAnimator";
import { Engine } from "../Engine/Engine";

const INITIAL_TOPVIEW_POSITION = new Vector3(0, 3000);
const ANIMATION_DURATION = 1;

export class OrthographicController implements ICameraController {
  engine: Engine;
  orthographicCamera: OrthographicCamera;

  // pose
  orthographicPose: Pose;
  topviewPose: Pose;

  constructor(engine: Engine) {
    this.engine = engine;
    this.setup();
  }

  setup() {
    this.orthographicCamera = new OrthographicCamera(
      -1000,
      1000,
      100,
      -100,
      NEAR,
      FAR
    );

    this.orthographicCamera.position.copy(INITIAL_CAMERA_POSITION);
    this.orthographicCamera.lookAt(new Vector3(0, 0, 0));

    const orthographicRotation = new Quaternion();
    orthographicRotation.setFromEuler(this.orthographicCamera.rotation);
    this.orthographicPose = {
      position: this.orthographicCamera.position.clone(),
      rotation: orthographicRotation,
    };

    this.topviewPose = {
      position: INITIAL_TOPVIEW_POSITION.clone(),
      rotation: this.topviewRotation,
    };
  }

  onResize(width: number, height: number) {
    this.orthographicCamera.left = width / -2;
    this.orthographicCamera.right = width / 2;
    this.orthographicCamera.top = height / 2;
    this.orthographicCamera.bottom = height / -2;
  }

  get camera() {
    return this.orthographicCamera;
  }

  get topviewRotation() {
    const topviewRotation = new Quaternion();
    topviewRotation.setFromEuler(new Euler(-Math.PI / 2, 0, 0));
    return topviewRotation;
  }

  onChange(prevType: CameraType, newType: CameraType) {
    // store current pose
    if (prevType === CameraType.Orthographic) {
      const fromRot = new Quaternion();
      fromRot.setFromEuler(this.orthographicCamera.rotation);
      this.orthographicPose = {
        position: this.orthographicCamera.position.clone(),
        rotation: fromRot,
      };
    } else if (prevType === CameraType.TopView) {
      this.topviewPose.position = this.orthographicCamera.position.clone();
    }

    // restore pose of newtype
    const toRot = new Quaternion();
    const toPose: Pose = {
      position: new Vector3(),
      rotation: toRot,
    };
    if (newType === CameraType.Orthographic) {
      toPose.position.copy(this.orthographicPose.position);
      toRot.copy(this.orthographicPose.rotation);
    } else if (newType === CameraType.TopView) {
      toPose.position.copy(this.topviewPose.position);
      toRot.copy(this.topviewRotation);
    }

    // animation
    const animator = new LerpAnimator(this.engine, this.orthographicCamera);
    animator.animate(ANIMATION_DURATION, toPose);
    this.engine.addAnimator(this.orthographicCamera.id.toString(), animator);
  }
}
