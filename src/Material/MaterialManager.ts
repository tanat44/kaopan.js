import { LineBasicMaterialLibrary } from "./LineBasicMaterialLibrary";
import { MeshBasicMaterialLibary } from "./MeshBasicMaterialLibrary";

export class MaterialManager {
  lineBasicMaterialLibrary: LineBasicMaterialLibrary;
  meshBasicMaterialLibrary: MeshBasicMaterialLibary;

  constructor() {
    this.lineBasicMaterialLibrary = new LineBasicMaterialLibrary();
    this.meshBasicMaterialLibrary = new MeshBasicMaterialLibary();
  }
}
