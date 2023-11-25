import { RenderType } from "../../Data/types";
import { Engine } from "../../Engine/Engine";
import { StrokeGeometry } from "../../Geometry/Stroke/StrokeGeometry";
import { StrokeMaterial } from "../../Geometry/Stroke/StrokeMaterial";
import { InstancedRenderBase } from "./InstancedRenderBase";

export class InstancedStrokeRender extends InstancedRenderBase {
  constructor(engine: Engine) {
    super(engine);
    this.geometry = new StrokeGeometry();
    this.material = new StrokeMaterial();
    this.type = RenderType.Stroke;
    this.addInstancedMesh();
  }
}
