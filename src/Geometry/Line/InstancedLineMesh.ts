import { Color, DoubleSide, InstancedMesh, MeshBasicMaterial } from "three";
import { LineGeometry } from "./LineGeometry";

export class InstancedLineMesh extends InstancedMesh {
  constructor(count: number) {
    const geometry = new LineGeometry();
    const material = new MeshBasicMaterial({
      color: new Color("white"),
      side: DoubleSide,
      opacity: 1.0,
      transparent: true,
    });
    super(geometry, material, count);
  }
}
