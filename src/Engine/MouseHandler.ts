import { Camera, MOUSE, Object3D, Plane, Vector2, Vector3 } from "three";
import { Engine } from "./Engine";
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { name } from "../Data/types";

const LEFT_BUTTON = 0;

export class MouseHandler {
  engine: Engine;
  orbitControl: OrbitControls;
  ignoreObjects: Set<name>;

  clickPosition: Vector3;
  objectOriginalPosition: Vector3;
  draggingObjectName: name;

  constructor(canvasId: string, engine: Engine) {
    this.engine = engine;
    this.setupOrbitControl();
    this.ignoreObjects = new Set();

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
    const pointer = new Vector2();
    pointer.x = (e.clientX / this.engine.container.offsetWidth) * 2 - 1;
    pointer.y = -(e.clientY / this.engine.container.offsetHeight) * 2 + 1;
    this.engine.raycaster.setFromCamera(
      pointer,
      this.engine.cameraManager.currentCamera
    );

    let intersections = this.engine.raycaster.intersectObjects(
      this.engine.scene.children
    );
    intersections = intersections.filter(
      (intersection) => !this.ignoreObjects.has(intersection.object.name)
    );
    if (intersections.length == 0) return;
    const object = intersections[0].object;
    const instanceId = intersections[0].instanceId;

    const objectName = this.engine.renderer.findObjectName(object, instanceId);
    if (!objectName) return;
    this.draggingObjectName = objectName;
    this.objectOriginalPosition = this.engine.renderer.getGlobalPosition(
      this.draggingObjectName
    );
    this.clickPosition = this.findGroundPlaneIntersection(e);
    console.log("clicked:", this.draggingObjectName);

    this.engine.transformer.setTransformObject(
      objectName,
      this.engine.renderer.getMatrix(objectName)
    );
  }

  onMouseMove(e: MouseEvent) {
    if (!this.draggingObjectName) return;
    const x = this.findGroundPlaneIntersection(e);
    x.sub(this.clickPosition).add(this.objectOriginalPosition);
    this.engine.renderer.updatePosition(this.draggingObjectName, x);
    this.engine.render();
  }

  findGroundPlaneIntersection(e: MouseEvent) {
    var groundPlane = new Plane(new Vector3(0, 1, 0), 0);
    const pointer = new Vector2();
    pointer.x = (e.clientX / this.engine.container.offsetWidth) * 2 - 1;
    pointer.y = -(e.clientY / this.engine.container.offsetHeight) * 2 + 1;
    this.engine.raycaster.setFromCamera(
      pointer,
      this.engine.cameraManager.currentCamera
    );
    var intersect = new Vector3();
    this.engine.raycaster.ray.intersectPlane(groundPlane, intersect);
    return intersect;
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
}
