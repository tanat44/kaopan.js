import { Mesh, SphereGeometry } from "three";
import { RenderObject, RenderType } from "../../Data/types";
import { Engine } from "../../Engine/Engine";
import { SimpleRenderBase } from "./SimpleRenderBase";

const SEGMENTS = 24;

export class SimpleSphereRender extends SimpleRenderBase {
  constructor(engine: Engine) {
    super(engine);
    this.geometry = new SphereGeometry(1, SEGMENTS, SEGMENTS);
    this.type = RenderType.Sphere;
  }

  create(object: RenderObject): Mesh {
    const material = this.engine.materials.meshToonMaterialLibrary.getMaterial(
      object.color
    );
    const mesh = new Mesh(this.geometry, material);
    mesh.name = object.name;
    this.update(object, mesh);
    return mesh;
  }
}
