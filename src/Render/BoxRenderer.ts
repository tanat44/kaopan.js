import { BoxGeometry, Euler, Mesh, MeshBasicMaterial } from "three";
import { Engine } from "../Engine/Engine";
import { RendererBase } from "./RendererBase";
import { RenderObject } from "../Data/types";

export class BoxRenderer extends RendererBase {
  constructor(engine: Engine) {
    super(engine);
    this.geometry = new BoxGeometry(1, 1, 1);
  }

  create(object: RenderObject): Mesh {
    const material = this.engine.assets.meshBasicMaterialLibrary.getMaterial(
      object.color
    );
    const mesh = new Mesh(this.geometry, material);
    this.update(object, mesh);
    return mesh;
  }
}
