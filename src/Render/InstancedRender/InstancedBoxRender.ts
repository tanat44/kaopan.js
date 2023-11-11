import { BoxGeometry } from "three";
import { Engine } from "../../Engine/Engine";
import { InstancedRenderBase } from "./InstancedRenderBase";
import { RenderType } from "../../Data/types";

export class InstancedBoxRender extends InstancedRenderBase {
  constructor(engine: Engine) {
    super(engine);
    this.geometry = new BoxGeometry(1, 1, 1);
    this.type = RenderType.Box;
    this.addInstancedMesh();
  }
}
