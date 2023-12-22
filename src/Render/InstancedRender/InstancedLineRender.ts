import { Matrix4, Vector3 } from "three";
import { RenderObject, RenderType } from "../../Data/types";
import { Engine } from "../../Engine/Engine";
import { InstancedLineMesh } from "../../Geometry/Line/InstancedLineMesh";
import {
  InstanceRef,
  InstancedRenderBase,
  MAX_OBJECTS_IN_INSTANCE,
} from "./InstancedRenderBase";

export class InstancedLineRender extends InstancedRenderBase {
  constructor(engine: Engine) {
    super(engine);
    this.type = RenderType.Line;
    this.addInstancedMesh();
  }

  protected override createMesh() {
    return new InstancedLineMesh(MAX_OBJECTS_IN_INSTANCE);
  }

  override applyScale(object: RenderObject, matrix: Matrix4) {
    // must do nothing
  }

  override applyRotation(object: RenderObject, matrix: Matrix4) {
    // must do nothing
  }

  override applyCustomMatrix(
    object: RenderObject,
    instanceRef: InstanceRef,
    matrix: Matrix4
  ): void {
    if (!object.controlPoints || object.controlPoints.length < 2) return;

    let strokeWidth = object.strokeWidth ?? 1;
    const from = object.controlPoints[0];
    const to = object.controlPoints[1];
    const v = to.clone().sub(from);
    const length = v.length();

    // rot
    const m_rot = new Matrix4();
    const normal = new Vector3(1, 0, 0).cross(v);
    const theta = Math.asin(normal.length() / length);
    m_rot.makeRotationAxis(normal.normalize(), theta);

    // scale
    const m_scale = new Matrix4();
    m_scale.makeScale(length, strokeWidth, 1);

    matrix.multiply(m_rot).multiply(m_scale).setPosition(from);
  }
}
