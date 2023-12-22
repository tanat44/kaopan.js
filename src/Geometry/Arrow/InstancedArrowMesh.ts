import { Color, DoubleSide, InstancedMesh, MeshBasicMaterial } from "three";
import { ArrowGeometry } from "./ArrowGeometry";

export class InstancedArrowMesh extends InstancedMesh {
  constructor(count: number) {
    const geometry = new ArrowGeometry();
    // const material = new ArrowMaterial();
    const material = new MeshBasicMaterial({
      color: new Color("white"),
      side: DoubleSide,
      opacity: 1.0,
      transparent: true,
      depthTest: false,
    });
    super(geometry, material, count);
  }
}
