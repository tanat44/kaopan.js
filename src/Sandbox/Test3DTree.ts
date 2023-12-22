import { Vector3 } from "three";
import { RenderObject, RenderType } from "../Data/types";
import { Engine } from "../Engine/Engine";

export const createTest3DTree = (engine: Engine, count: number) => {
  const objects: RenderObject[] = [];
  for (let i = 0; i < count; ++i) {
    const snowSize = 8;
    const treeSize = 30;
    const levelHeight = 30;
    const snow = {
      name: `snow${i}`,
      type: RenderType.Sphere,
      position: new Vector3(0, levelHeight * 0.5, 0),
      scale: new Vector3(snowSize, snowSize, snowSize),
      color: "#fffeed",
    };
    const level3: RenderObject = {
      name: `level3_${i}`,
      type: RenderType.Box,
      gpuInstancing: true,
      position: new Vector3(0, levelHeight, 0),
      scale: new Vector3(treeSize * 0.3, levelHeight, treeSize * 0.3),
      color: "#78b522",
      children: [snow],
    };
    const level2: RenderObject = {
      name: `level2_${i}`,
      type: RenderType.Box,
      gpuInstancing: true,
      position: new Vector3(0, levelHeight, 0),
      scale: new Vector3(treeSize * 0.8, levelHeight, treeSize * 0.8),
      color: "#399e23",
      children: [level3],
    };
    const tree: RenderObject = {
      name: `tree_${i}`,
      type: RenderType.Box,
      gpuInstancing: true,
      position: new Vector3(
        Math.random() * 2000 - 1000,
        Math.random() * 1000,
        Math.random() * 2000 - 1000
      ),
      scale: new Vector3(treeSize, levelHeight, treeSize),
      color: "#216631",
      children: [level2],
    };
    objects.push(tree);
  }
  engine.renderer.updateObject(objects);
};
