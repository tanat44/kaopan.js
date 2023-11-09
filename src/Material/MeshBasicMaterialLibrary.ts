import { Color, DoubleSide, MeshBasicMaterial } from "three";
import { MaterialLibraryBase } from "./MaterialLibraryBase";

export class MeshBasicMaterialLibary extends MaterialLibraryBase<MeshBasicMaterial> {
  createMaterial(color: string): MeshBasicMaterial {
    return new MeshBasicMaterial({
      color: new Color(color),
      side: DoubleSide,
      opacity: 1.0,
      transparent: true,
    });
  }
}
