import { Color, Vector3 } from "three";

//@ts-ignore
import { Line2 } from "three/addons/lines/Line2.js";
//@ts-ignore
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
//@ts-ignore
import { LineGeometry } from "three/addons/lines/LineGeometry.js";

export function createLine2() {
  const points: Vector3[] = [];
  points.push(new Vector3(-0.5, 0, -0.5));
  points.push(new Vector3(0.5, 0, -0.5));
  points.push(new Vector3(0.5, 0, 0.5));
  points.push(new Vector3(-0.5, 0, 0.5));
  points.push(new Vector3(-0.5, 0, -0.5));

  this.geometry = new LineGeometry();
  const positions: number[] = [];
  const colors: number[] = [];
  const color = new Color(0x412353);
  points.forEach((p) => {
    positions.push(p.x, p.y, p.z);
    colors.push(color.r, color.g, color.b);
  });
  this.geometry.setPositions(positions);
  this.geometry.setColors(colors);

  const matLine = new LineMaterial({
    color: 0xffffff,
    linewidth: 3, // in world units with size attenuation, pixels otherwise
    vertexColors: true,
    dashed: false,
    alphaToCoverage: true,
  });
  matLine.resolution.set(this.engine.width, this.engine.height);

  this.mesh = new Line2(this.geometry, matLine);
  this.mesh.computeLineDistances();
  this.mesh.scale.set(1, 1, 1);
}
