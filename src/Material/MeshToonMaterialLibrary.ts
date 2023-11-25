import { Color, DoubleSide, MeshToonMaterial } from "three";
import { MaterialLibraryBase } from "./MaterialLibraryBase";

export class MeshToonMaterialLibary extends MaterialLibraryBase<MeshToonMaterial> {
  createMaterial(color: string): MeshToonMaterial {
    return new MeshToonMaterial({
      color: new Color(color),
      side: DoubleSide,
      opacity: 1.0,
      transparent: true,
    });
  }
}
