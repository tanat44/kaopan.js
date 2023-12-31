import { BoxGeometry, Mesh } from "three";
import { RenderObject, RenderType } from "../../Data/types";
import { Engine } from "../../Engine/Engine";
import { SimpleRenderBase } from "./SimpleRenderBase";

export class SimpleBoxRender extends SimpleRenderBase {
  constructor(engine: Engine) {
    super(engine);
    this.geometry = new BoxGeometry(1, 1, 1);
    this.type = RenderType.Box;
  }

  create(object: RenderObject): Mesh {
    const material = this.engine.materials.meshBasicMaterialLibrary.getMaterial(
      object.color
    );
    const mesh = new Mesh(this.geometry, material);
    mesh.name = object.name;
    this.update(object, mesh);
    return mesh;
  }
}
