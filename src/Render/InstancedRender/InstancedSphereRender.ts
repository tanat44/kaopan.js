import { SphereGeometry } from "three";
import { Engine } from "../../Engine/Engine";
import { InstancedRenderBase } from "./InstancedRenderBase";
import { RenderType } from "../../Data/types";

export class InstancedSphereRenderer extends InstancedRenderBase {
  constructor(engine: Engine) {
    super(engine);
    this.geometry = new SphereGeometry(1, 10, 10);
    this.type = RenderType.Sphere;
    this.addInstancedMesh();
  }
}
