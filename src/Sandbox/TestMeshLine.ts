import { BufferGeometry, Color, Mesh, Vector3 } from "three";
import { Engine } from "../Engine/Engine";
import { MeshLine, MeshLineMaterial } from "../Library/MeshLine";

export const createTestMeshLine = (engine: Engine): void => {
  const points = [];
  for (let j = 0; j < Math.PI; j += 0.1) {
    points.push(new Vector3(Math.cos(j) * 100, Math.sin(j) * 100, 0));
  }
  const geometry = new BufferGeometry().setFromPoints(points);
  const line = new MeshLine();
  line.setGeometry(geometry);
  const material = new MeshLineMaterial({
    lineWidth: 20,
    // depthTest: false,
    color: new Color(0x74ebd5),
  });
  const mesh = new Mesh(line as any, material as any);
  engine.sceneManager.addObject(mesh, true);
};
