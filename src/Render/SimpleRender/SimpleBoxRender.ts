import { BoxGeometry, Euler, Mesh } from "three";
import { Engine } from "../../Engine/Engine";
import { SimpleRenderBase } from "./SimpleRenderBase";
import { RenderObject } from "../../Data/types";

export class SimpleBoxRender extends SimpleRenderBase {
  constructor(engine: Engine) {
    super(engine);
    this.geometry = new BoxGeometry(1, 1, 1);
  }

  create(object: RenderObject): Mesh {
    const material = this.engine.assets.meshBasicMaterialLibrary.getMaterial(
      object.color
    );
    const mesh = new Mesh(this.geometry, material);
    mesh.name = object.name;
    this.update(object, mesh);
    return mesh;
  }
}
