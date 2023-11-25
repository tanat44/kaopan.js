import {
  Camera,
  Intersection,
  MOUSE,
  Object3D,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import { Engine } from "./Engine";
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { name } from "../Data/types";

const LEFT_BUTTON = 0;
const GROUND_PLANE_HEIGHT = 1;

type IntersectionResult = {
  count: number;
  point: Vector3;
  object: Object3D;
  instanceId: number;
};

export class SelectHandler {
  engine: Engine;
  raycaster: Raycaster;
  orbitControl: OrbitControls;

  clickPosition: Vector3;
  objectOriginalPosition: Vector3;
  draggingObjectName: name;

  constructor(canvasId: string, engine: Engine) {
    this.engine = engine;
    this.raycaster = new Raycaster();
    this.setupOrbitControl();

    const container = document.getElementById(canvasId);
    container.addEventListener("mousedown", (e: MouseEvent) =>
      this.onMouseDown(e)
    );
    container.addEventListener("mousemove", (e: MouseEvent) =>
      this.onMouseMove(e)
    );
    container.addEventListener("mouseup", (e: MouseEvent) => this.onMouseUp(e));
    this.objectOriginalPosition = new Vector3();
    this.clickPosition = new Vector3();
  }

  onMouseDown(e: MouseEvent) {
    if (e.button !== LEFT_BUTTON) return;
    const intersection = this.findIntersection(
      e,
      this.engine.sceneManager.interactables
    );
    console.log(intersection);

    if (intersection.count === 0) return;
    const objectName = this.engine.renderer.findObjectName(
      intersection.object,
      intersection.instanceId
    );
    if (!objectName) return;
    this.draggingObjectName = objectName;
    this.objectOriginalPosition = this.engine.renderer.getGlobalPosition(
      this.draggingObjectName
    );
    this.clickPosition = this.findPlaneIntersection(e, GROUND_PLANE_HEIGHT);
    console.log("clicked:", this.draggingObjectName);
    this.engine.transformer.setTransformObject(
      objectName,
      this.engine.renderer.getMatrix(objectName)
    );
  }

  onMouseMove(e: MouseEvent) {
    const intersection = this.findPlaneIntersection(e, GROUND_PLANE_HEIGHT);
    if (!this.draggingObjectName) return;

    console.log(this.draggingObjectName);
    // if (!this.draggingObjectName) this.highlightObject(intersection);
    intersection.sub(this.clickPosition).add(this.objectOriginalPosition);
    this.engine.renderer.updatePosition(this.draggingObjectName, intersection);
    this.engine.render();
  }

  highlightObject(intersection: Intersection) {}

  findPlaneIntersection(e: MouseEvent, y: number) {
    var groundPlane = new Plane(new Vector3(0, y, 0), 0);
    const pointer = new Vector2();
    pointer.x = (e.clientX / this.engine.container.offsetWidth) * 2 - 1;
    pointer.y = -(e.clientY / this.engine.container.offsetHeight) * 2 + 1;
    this.raycaster.setFromCamera(
      pointer,
      this.engine.cameraManager.currentCamera
    );
    var intersect = new Vector3();
    this.raycaster.ray.intersectPlane(groundPlane, intersect);
    return intersect;
  }

  findIntersection(e: MouseEvent, objects: Object3D[]): IntersectionResult {
    const pointer = new Vector2();
    pointer.x = (e.clientX / this.engine.container.offsetWidth) * 2 - 1;
    pointer.y = -(e.clientY / this.engine.container.offsetHeight) * 2 + 1;
    this.raycaster.setFromCamera(
      pointer,
      this.engine.cameraManager.currentCamera
    );
    let intersections = this.raycaster.intersectObjects(
      this.engine.sceneManager.interactables
    );

    // this.raycaster.setFromCamera(
    //   this.pointerPosition(e),
    //   this.engine.cameraManager.currentCamera
    // );

    // let intersections = this.raycaster.intersectObjects(objects);
    console.log(intersections);
    const result: IntersectionResult = {
      count: intersections.length,
      point: intersections[0]?.point,
      object: intersections[0]?.object,
      instanceId: intersections[0]?.instanceId,
    };
    return result;
  }

  onMouseUp(e: MouseEvent) {
    this.draggingObjectName = null;
  }

  setupOrbitControl() {
    this.orbitControl = new OrbitControls(
      this.engine.cameraManager.currentCamera,
      this.engine.webglRenderer.domElement
    );
    this.orbitControl.damping = 0.2;
    this.orbitControl.mouseButtons = {
      MIDDLE: MOUSE.ROTATE,
      RIGHT: MOUSE.PAN,
    };
    this.orbitControl.addEventListener("change", () => this.engine.render());
  }

  onCameraChange(newCamera: Camera) {
    console.log("a");
    this.orbitControl.camera = newCamera;
  }

  pointerPosition(e: MouseEvent): Vector2 {
    const pointer = new Vector2();
    pointer.x = (e.clientX / this.engine.width) * 2 - 1;
    pointer.y = -(e.clientY / this.engine.height) * 2 + 1;
    return pointer;
  }
}
