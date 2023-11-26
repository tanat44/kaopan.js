import { Mesh, Quaternion, Vector3 } from "three";
import { Engine } from "../../Engine/Engine";
import { StrokeGeometry } from "../../Geometry/Stroke/StrokeGeometry";
import { StrokeMaterial } from "../../Geometry/Stroke/StrokeMaterial";
import { InteractionHandler } from "../InteractionHandler";
import { MouseRay } from "../MouseRay";

const HOVER_COLOR = 0x4597f8;

export class Hover extends InteractionHandler {
  mouseRay: MouseRay;
  activeRectangle: Mesh;

  constructor(engine: Engine, mouseRay: MouseRay) {
    super(engine);
    this.mouseRay = mouseRay;

    // create mesh line
    const geometry = new StrokeGeometry();
    const material = new StrokeMaterial();
    material.depthTest = false;
    this.activeRectangle = new Mesh(geometry, material);
  }

  onMouseMove(e: MouseEvent): void {
    const intersection = this.mouseRay.findIntersection(e);
    if (!intersection.count) {
      this.engine.sceneManager.removeObject(this.activeRectangle);
      return;
    }
    const objectName = this.engine.renderer.findObjectName(
      intersection.object,
      intersection.instanceId
    );
    const matrix = this.engine.renderer.getMatrix(objectName);
    if (!matrix) return;
    const center = new Vector3();
    const rotation = new Quaternion();
    const scale = new Vector3();
    matrix.decompose(center, rotation, scale);
    center.y += 10.0;
    this.activeRectangle.scale.copy(scale);
    this.activeRectangle.position.copy(center);
    this.engine.sceneManager.addObject(this.activeRectangle, false);
  }
}
