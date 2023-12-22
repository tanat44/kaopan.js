import { Vector3 } from "three";
import { RenderType } from "../Data/types";
import { Engine } from "../Engine/Engine";

export const createTestInstanceLine = (engine: Engine): void => {
  engine.renderer.updateObject([
    {
      name: `line1`,
      type: RenderType.Line,
      gpuInstancing: true,
      color: "#3f6631",
      controlPoints: [new Vector3(0, 0, 0), new Vector3(100, 100, 0)],
      strokeWidth: 10,
    },
    {
      name: `arrow1`,
      type: RenderType.Arrow,
      gpuInstancing: true,
      color: "#ff6631",
      controlPoints: [new Vector3(0, 100, 0), new Vector3(300, 50, 0)],
      strokeWidth: 10,
    },
  ]);
};
