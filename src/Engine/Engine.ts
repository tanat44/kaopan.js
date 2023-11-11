import {
  AmbientLight,
  Clock,
  Color,
  GridHelper,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from "three";
// @ts-ignore
import { Assets } from "./Assets";
import { MouseHandler } from "./MouseHandler";
import { RenderObject, RenderType } from "../Data/types";
import Stats from "three/examples/jsm/libs/stats.module";
import { RenderManager } from "../Render/Renderer";

export type TickCallback = (dt: number) => void;

export class Engine {
  container: HTMLElement;
  assets: Assets;
  mouseHandler: MouseHandler;
  renderer: RenderManager;

  // Threejs
  scene: Scene;
  camera: PerspectiveCamera;
  raycaster: Raycaster;
  webglRenderer: WebGLRenderer;
  stats: Stats;

  // animation loop
  clock: Clock;
  tickCallbacks: TickCallback[];

  constructor(canvasId: string) {
    this.assets = new Assets(this);
    this.raycaster = new Raycaster();
    this.setupScene(canvasId);
    this.setupLighting();
    this.tickCallbacks = [];
    this.mouseHandler = new MouseHandler(canvasId, this);
    this.setupGrid();
    this.renderer = new RenderManager(this);

    // render test objects
    const num = 10000;
    document.getElementById("info").innerHTML = `instanced mesh count: ${num}`;
    const objs = this.generateObjects(num);
    this.renderer.updateObject(objs);
  }

  setupLighting() {
    this.scene.add(new AmbientLight(0xf0f0f0));
    const light = new SpotLight(0xffffff, 1.5);
    light.position.set(0, 1500, 200);
    light.angle = Math.PI * 0.2;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = -0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add(light);
  }

  setupScene(canvasId: string) {
    this.scene = new Scene();
    this.scene.background = new Color(0xf0f0f0);

    this.container = document.getElementById(canvasId);
    var width = this.container.offsetWidth;
    var height = this.container.offsetHeight;
    this.camera = new PerspectiveCamera(70, width / height, 0.1, 999999);
    this.camera.position.set(0, 3000, 2000);
    this.camera.lookAt(new Vector3(0, 0, 0));
    this.scene.add(this.camera);
    this.webglRenderer = new WebGLRenderer({ antialias: true });
    this.webglRenderer.setPixelRatio(window.devicePixelRatio);
    this.webglRenderer.setSize(width, height);
    this.webglRenderer.shadowMap.enabled = true;
    this.clock = new Clock();
    this.webglRenderer.setAnimationLoop(() => this.tick());

    this.container.appendChild(this.webglRenderer.domElement);
    this.resize(width, height);

    // statistic
    this.stats = new Stats();
    this.container.appendChild(this.stats.dom);
  }

  setupGrid() {
    // draw grid helper
    const grid = new GridHelper(2000, 100);
    grid.name = "gridHelper";
    grid.position.y = 0;
    (grid.material as any).opacity = 0.25;
    (grid.material as any).transparent = true;
    this.scene.add(grid);
    this.mouseHandler.ignoreObjects.add(grid.name);
  }

  tick() {
    if (this.stats) this.stats.update();

    const dt = this.clock.getDelta();
    this.tickCallbacks.map((fn) => fn(dt));
    this.render();
  }

  registerTickCallback(callback: TickCallback) {
    this.tickCallbacks.push(callback);
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.webglRenderer.setSize(width, height);
    this.render();
  }

  render() {
    this.webglRenderer.render(this.scene, this.camera);
  }

  generateObjects(number: number) {
    const objects: RenderObject[] = [];
    for (let i = 0; i < number; ++i) {
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
    return objects;
  }

  randomHexColor(): string {
    const value = Math.floor(Math.random() * 0xffffff);
    const hexString = String(value.toString(16)).padEnd(6, "F");
    return `#${hexString}`;
  }
}
