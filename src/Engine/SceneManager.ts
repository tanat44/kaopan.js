import {
  AmbientLight,
  Color,
  GridHelper,
  Object3D,
  Scene,
  SpotLight,
} from "three";
import { Engine } from "./Engine";

export class SceneManager {
  scene: Scene;
  engine: Engine;

  nonInteractables: Set<number>;
  sceneManager: any;

  constructor(engine: Engine) {
    this.engine = engine;
    this.nonInteractables = new Set();
    this.scene = new Scene();
    this.scene.background = new Color(0xf0f0f0);
    this.drawGrid();
    this.setupLighting();
  }

  drawGrid() {
    const grid = new GridHelper(2000, 100);
    grid.position.y = 0;
    (grid.material as any).opacity = 0.25;
    (grid.material as any).transparent = true;
    this.addObject(grid, false);
  }

  setupLighting() {
    const ambientLight = new AmbientLight(0xf0f0f0);
    this.addObject(ambientLight, false);
    const spotLight = new SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 1500, 200);
    spotLight.angle = Math.PI * 0.2;
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 200;
    spotLight.shadow.camera.far = 2000;
    spotLight.shadow.bias = -0.000222;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    this.addObject(spotLight, false);
  }

  addObject(object: Object3D, interactable: boolean) {
    this.scene.add(object);
    if (!interactable) this.nonInteractables.add(object.id);
  }

  removeObject(object: Object3D) {
    this.scene.remove(object);
    this.nonInteractables.delete(object.id);
  }

  get interactables(): Object3D[] {
    const objects = this.scene.children;
    return objects.filter((obj) => !this.nonInteractables.has(obj.id));
  }
}
