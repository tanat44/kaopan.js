import { Vector3 } from "three";

export enum RenderType {
  // 3D
  Box,
  Sphere,
  Gltf,
  // 2D
  Square,
  Circle,
  Polyline,
}

export type Animation = {
  velocity: Vector3;
  acceleration: Vector3;
};

export type RenderObject = {
  name: string;
  type?: RenderType;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  color?: string;
  children?: RenderObject[];
  timestamp?: number;

  // modifiers
  animation?: Animation;
};
