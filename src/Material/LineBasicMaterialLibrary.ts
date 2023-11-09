import { LineBasicMaterial } from "three";
import { MaterialLibraryBase } from "./MaterialLibraryBase";

export class LineBasicMaterialLibrary extends MaterialLibraryBase<LineBasicMaterial> {
  createMaterial(color: string): LineBasicMaterial {
    return new LineBasicMaterial({
      color: color,
    });
  }
}
