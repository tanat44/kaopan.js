import { Mesh, Vector3 } from "three";
import { Engine } from "../../Engine/Engine";
import { StrokeGeometry } from "../../Geometry/Stroke/StrokeGeometry";
import { StrokeMaterial } from "../../Geometry/Stroke/StrokeMaterial";
import { InteractionHandler } from "../InteractionHandler";
import { MouseRay } from "../MouseRay";

export class SelectRectangle extends InteractionHandler {
  mouseRay: MouseRay;
  clickPosition: Vector3;

  selection: Mesh;

  constructor(engine: Engine) {
    super(engine);
    this.mouseRay = new MouseRay(engine);
    const geometry = new StrokeGeometry();
    const material = new StrokeMaterial();
    material.depthTest = false;
    this.selection = new Mesh(geometry, material);
  }

  onMouseDown(e: MouseEvent): void {
    this.clickPosition = this.mouseRay.findPlaneIntersection(e, 0);
    this.engine.sceneManager.addObject(this.selection, false);
    this.selection.scale.set(0, 0, 0);
  }

  onMouseMove(e: MouseEvent): void {
    const pos = this.mouseRay.findPlaneIntersection(e, 0);
    const size = pos.clone().sub(this.clickPosition);
    const center = this.clickPosition
      .clone()
      .add(size.clone().multiplyScalar(0.5));
    this.selection.position.copy(center);
    this.selection.scale.set(size.x, 1, size.z);
  }

  onMouseUp(e: MouseEvent): void {
    this.engine.sceneManager.removeObject(this.selection);
  }
}
