import { Box3, Mesh, Vector3 } from "three";
import { name } from "../../Data/types";
import { Engine } from "../../Engine/Engine";
import { StrokeGeometry } from "../../Geometry/Stroke/StrokeGeometry";
import { StrokeMaterial } from "../../Geometry/Stroke/StrokeMaterial";
import { InteractionHandler } from "../InteractionHandler";
import { MouseRay } from "../MouseRay";

export class SelectRectangle extends InteractionHandler {
  mouseRay: MouseRay;
  clickPosition: Vector3;

  selection: Mesh;

  constructor(engine: Engine, mouseRay: MouseRay) {
    super(engine);
    this.mouseRay = mouseRay;
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

  getObjectNames(): name[] {
    // create 3d selection box
    const delta = this.selection.scale.clone().multiplyScalar(0.5);
    const min = this.selection.position.clone().sub(delta);
    min.y = -Infinity;
    const max = this.selection.position.clone().add(delta);
    max.y = Infinity;
    const box = new Box3(min, max);

    const names = this.engine.renderer.getIntersectObjects(box);
    return names;
  }
}
