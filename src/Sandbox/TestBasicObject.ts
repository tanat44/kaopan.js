import { Vector3 } from "three";
import { RenderType } from "../Data/types";
import { Engine } from "../Engine/Engine";

export const createTestBasicObject = (engine: Engine): void => {
  engine.renderer.updateObject([
    {
      name: `tree_1`,
      type: RenderType.Box,
      gpuInstancing: false,
      position: new Vector3(0, 400, 100),
      scale: new Vector3(100, 100, 100),
      color: "#ff6631",
    },
  ]);
};
