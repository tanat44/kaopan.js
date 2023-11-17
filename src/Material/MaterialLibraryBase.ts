import { Material } from "three";

export abstract class MaterialLibraryBase<T> {
  library: Map<string, Material>;

  constructor() {
    this.library = new Map();
  }

  getMaterial(color: string = null): Material {
    if (!color) color = "0xffffff";
    if (this.library.has(color)) return this.library.get(color);
    const mat = this.createMaterial(color) as Material;
    this.library.set(color, mat);
    return mat;
  }

  createMaterial(color: string): Material {
    return null;
  }
}
