import { Object3D, Plane, Raycaster, Vector2, Vector3 } from "three";
import { Engine } from "../Engine/Engine";

export type IntersectionResult = {
  count: number;
  point: Vector3;
  object: Object3D;
  instanceId: number;
};

export class MouseRay {
  engine: Engine;
  raycaster: Raycaster;

  constructor(engine: Engine) {
    this.engine = engine;
    this.raycaster = new Raycaster();
  }

  findPlaneIntersection(e: MouseEvent, y: number) {
    var groundPlane = new Plane(new Vector3(0, 1, 0), 0);
    groundPlane.translate(new Vector3(0, y, 0));
    this.raycaster.setFromCamera(
      this.pointerPosition(e),
      this.engine.cameraManager.currentCamera
    );
    var point = new Vector3();
    this.raycaster.ray.intersectPlane(groundPlane, point);
    return point;
  }

  findIntersection(e: MouseEvent): IntersectionResult {
    this.raycaster.setFromCamera(
      this.pointerPosition(e),
      this.engine.cameraManager.currentCamera
    );
    let intersections = this.raycaster.intersectObjects(
      this.engine.sceneManager.interactables
    );
    const result: IntersectionResult = {
      count: intersections.length,
      point: intersections[0]?.point,
      object: intersections[0]?.object,
      instanceId: intersections[0]?.instanceId,
    };
    return result;
  }

  pointerPosition(e: MouseEvent): Vector2 {
    const pointer = new Vector2();
    pointer.x = (e.clientX / this.engine.width) * 2 - 1;
    pointer.y = -(e.clientY / this.engine.height) * 2 + 1;
    return pointer;
  }
}
