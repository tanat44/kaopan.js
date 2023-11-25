import { LineBasicMaterialLibrary } from "./LineBasicMaterialLibrary";
import { MeshBasicMaterialLibary } from "./MeshBasicMaterialLibrary";
import { MeshToonMaterialLibary } from "./MeshToonMaterialLibrary";

export class MaterialManager {
  lineBasicMaterialLibrary: LineBasicMaterialLibrary;
  meshBasicMaterialLibrary: MeshBasicMaterialLibary;
  meshToonMaterialLibrary: MeshToonMaterialLibary;

  constructor() {
    this.lineBasicMaterialLibrary = new LineBasicMaterialLibrary();
    this.meshBasicMaterialLibrary = new MeshBasicMaterialLibary();
    this.meshToonMaterialLibrary = new MeshToonMaterialLibary();
  }
}
