export abstract class MaterialLibraryBase<T> {
  library: Map<string, T>;

  constructor() {
    this.library = new Map();
  }

  getMaterial(color: string = null): T {
    if (!color) color = "0xffffff";
    if (this.library.has(color)) return this.library.get(color);
    const mat = this.createMaterial(color);
    this.library.set(color, mat);
    return mat;
  }

  createMaterial(color: string): T {
    return null;
  }
}
