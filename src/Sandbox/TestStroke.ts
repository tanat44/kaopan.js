import { Mesh } from "three";
import { Engine } from "../Engine/Engine";
import { StrokeGeometry } from "../Geometry/Stroke/StrokeGeometry";
import { StrokeMaterial } from "../Geometry/Stroke/StrokeMaterial";

export function createStroke(engine: Engine) {
  const geometry = new StrokeGeometry();
  const mat = new StrokeMaterial();
  const mesh = new Mesh(geometry, mat);
  mesh.scale.set(100, 1, 200);
  engine.sceneManager.addObject(mesh, false);
}
