import { Vector3 } from "three";

export enum RenderType {
  // 3D
  Box,
  Sphere,
  Gltf,
  // 2D
  Rectangle,
  Circle,
  Polyline,
  Line,
  Arrow,
  // etc
  Unknown,

  // Internal
  Stroke,
}

export type Animation = {
  velocity: Vector3;
  acceleration: Vector3;
};

export type name = string;

export type RenderObject = {
  name: name;
  type?: RenderType;
  gpuInstancing?: boolean;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  color?: string;
  children?: RenderObject[];
  timestamp?: number;

  // modifiers
  animation?: Animation;
  controlPoints?: Vector3[];
  strokeWidth?: number;
};
