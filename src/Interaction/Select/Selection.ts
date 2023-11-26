import { Engine } from "../../Engine/Engine";
// @ts-ignore
import { Mesh, Vector3 } from "three";
import { name } from "../../Data/types";
import { StrokeGeometry } from "../../Geometry/Stroke/StrokeGeometry";
import { StrokeMaterial } from "../../Geometry/Stroke/StrokeMaterial";
import { MouseRay } from "../MouseRay";

type SelectObject = {
  name: name;
  highlightMesh: Mesh;
  originalPosition: Vector3;
};

export class Selection {
  engine: Engine;
  mouseRay: MouseRay;
  selectedObjects: Map<name, SelectObject>;
  geometry: StrokeGeometry;
  material: StrokeMaterial;

  constructor(engine: Engine, mouseRay: MouseRay) {
    this.engine = engine;
    this.mouseRay = mouseRay;
    this.selectedObjects = new Map();

    this.geometry = new StrokeGeometry();
    this.material = new StrokeMaterial();
    this.material.depthTest = false;
  }

  deselect() {
    this.selectedObjects.forEach((selectObject, name) => {
      this.engine.sceneManager.removeObject(selectObject.highlightMesh);
    });
    this.selectedObjects.clear();
  }

  select(names: name[]) {
    this.deselect();
    names.forEach((name) => {
      const matrix = this.engine.renderer.getMatrix(name);
      const highlightMesh = new Mesh(this.geometry, this.material);
      highlightMesh.applyMatrix4(matrix);
      this.engine.sceneManager.addObject(highlightMesh, false);

      const position = new Vector3();
      position.setFromMatrixPosition(matrix);
      this.selectedObjects.set(name, {
        name,
        highlightMesh,
        originalPosition: position,
      });
    });
  }

  move(delta: Vector3) {
    this.selectedObjects.forEach((selectObject, name) => {
      const newPosition = selectObject.originalPosition.clone().add(delta);
      this.engine.renderer.updatePosition(name, newPosition);
      selectObject.highlightMesh.position.copy(newPosition);
    });
  }

  get count() {
    return this.selectedObjects.size;
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
