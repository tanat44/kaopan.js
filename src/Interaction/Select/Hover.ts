import { Color, Quaternion, Vector3 } from "three";
import { Engine } from "../../Engine/Engine";
import { InteractionHandler } from "../InteractionHandler";
import { MouseRay } from "../MouseRay";

//@ts-ignore
import { Line2 } from "three/addons/lines/Line2.js";
//@ts-ignore
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
//@ts-ignore
import { LineGeometry } from "three/addons/lines/LineGeometry.js";

const HOVER_COLOR = 0x4597f8;

export class Hover extends InteractionHandler {
  mouseRay: MouseRay;

  geometry: LineGeometry;
  mesh: Line2;

  constructor(engine: Engine) {
    super(engine);
    this.mouseRay = new MouseRay(engine);

    // create mesh line
    const points: Vector3[] = [];
    points.push(new Vector3(-0.5, 0, -0.5));
    points.push(new Vector3(0.5, 0, -0.5));
    points.push(new Vector3(0.5, 0, 0.5));
    points.push(new Vector3(-0.5, 0, 0.5));
    points.push(new Vector3(-0.5, 0, -0.5));
    // this.geometry = new BufferGeometry().setFromPoints(points);
    // const line = new MeshLine();
    // line.setGeometry(this.geometry);
    // const material = new MeshLineMaterial({
    //   lineWidth: 20,
    //   depthTest: false,
    //   color: new Color(HOVER_COLOR),
    // });
    // this.mesh = new Mesh(line as any, material as any);

    this.geometry = new LineGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const color = new Color(HOVER_COLOR);
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
    // scene.add( line );
  }

  onMouseMove(e: MouseEvent): void {
    const intersection = this.mouseRay.findIntersection(e);
    if (!intersection.count) {
      this.engine.sceneManager.removeObject(this.mesh);
      return;
    }
    const objectName = this.engine.renderer.findObjectName(
      intersection.object,
      intersection.instanceId
    );
    const matrix = this.engine.renderer.getMatrix(objectName);
    const center = new Vector3();
    const rotation = new Quaternion();
    const scale = new Vector3();
    matrix.decompose(center, rotation, scale);
    center.y += 2.0;
    this.mesh.scale.copy(scale);
    this.mesh.position.copy(center);
    this.engine.sceneManager.addObject(this.mesh, false);
  }
}
