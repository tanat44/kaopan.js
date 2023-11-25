import { Engine } from "../../Engine/Engine";
// @ts-ignore
import { Mesh } from "three";
import { name } from "../../Data/types";
import { StrokeGeometry } from "../../Geometry/Stroke/StrokeGeometry";
import { StrokeMaterial } from "../../Geometry/Stroke/StrokeMaterial";

export class Selection {
  engine: Engine;
  selectedObjects: Set<name>;
  meshes: Mesh[];
  geometry: StrokeGeometry;
  material: StrokeMaterial;

  constructor(engine: Engine) {
    this.engine = engine;
    this.selectedObjects = new Set();
    this.meshes = [];

    this.geometry = new StrokeGeometry();
    this.material = new StrokeMaterial();
    this.material.depthTest = false;
  }

  deselect() {
    this.meshes.forEach((mesh) => {
      this.engine.sceneManager.removeObject(mesh);
    });
    this.meshes = [];
    this.selectedObjects.clear();
  }

  select(names: name[]) {
    names.forEach((name) => {
      const matrix = this.engine.renderer.getMatrix(name);
      const mesh = new Mesh(this.geometry, this.material);
      mesh.applyMatrix4(matrix);
      this.meshes.push(mesh);
      this.engine.sceneManager.addObject(mesh, false);
    });
  }

  // select(names: name[]) {
  //   const parentMatrix = new Matrix4();
  //   names.forEach((name) => {
  //     const matrix = this.engine.renderer.getMatrix(name);
  //     const position = new Vector3();
  //     const rotation = new Quaternion();
  //     const scale = new Vector3();
  //     matrix.decompose(position, rotation, scale);
  //     const obj: RenderObject = {
  //       name,
  //       type: RenderType.Stroke,
  //       position,
  //       scale,
  //     };
  //     this.renderer.render(obj, parentMatrix);
  //     this.selectedObjects.add(name);
  //   });
  // }

  // get renderer() {
  //   return this.engine.renderer.instancedRenderManager.getInstanceRender(
  //     RenderType.Stroke
  //   );
  // }
}
