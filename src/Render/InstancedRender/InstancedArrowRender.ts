import { RenderType } from "../../Data/types";
import { Engine } from "../../Engine/Engine";
import { InstancedArrowMesh } from "../../Geometry/Arrow/InstancedArrowMesh";
import { InstancedLineRender } from "./InstancedLineRender";
import { MAX_OBJECTS_IN_INSTANCE } from "./InstancedRenderBase";

export class InstancedArrowRender extends InstancedLineRender {
  constructor(engine: Engine) {
    super(engine);
    this.type = RenderType.Arrow;
    this.addInstancedMesh();
  }

  protected override createMesh() {
    return new InstancedArrowMesh(MAX_OBJECTS_IN_INSTANCE);
  }
}
