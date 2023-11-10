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
import { RenderManager } from "../Render/RenderManager";
import { InstancedRenderManager } from "../InstancedRender/InstacedRenderManager";
import Stats from "three/examples/jsm/libs/stats.module";

export type TickCallback = (dt: number) => void;

export class Engine {
  container: HTMLElement;
  assets: Assets;
  mouseHandler: MouseHandler;
  renderManager: RenderManager;
  instancedRenderManager: InstancedRenderManager;

  // Threejs
  scene: Scene;
  camera: PerspectiveCamera;
  raycaster: Raycaster;
  renderer: WebGLRenderer;
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

    // setup render engine
    this.renderManager = new RenderManager(this);
    this.instancedRenderManager = new InstancedRenderManager(this);

    // render test objects
    const num = 500000;
    document.getElementById("info").innerHTML = `instanced mesh count: ${num}`;
    const objs = this.generateObjects(num);
    this.instancedRenderManager.updateObject(objs);
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
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.clock = new Clock();
    this.renderer.setAnimationLoop(() => this.tick());

    this.container.appendChild(this.renderer.domElement);
    this.resize(width, height);

    // draw grid helper
    const grid = new GridHelper(2000, 100);
    grid.position.y = 0;
    (grid.material as any).opacity = 0.25;
    (grid.material as any).transparent = true;
    this.scene.add(grid);

    // statistic
    this.stats = new Stats();
    this.container.appendChild(this.stats.dom);
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
    this.renderer.setSize(width, height);
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  generateObjects(number: number) {
    const objects: RenderObject[] = [];
    const size = 80;
    for (let i = 0; i < number; ++i) {
      objects.push({
        name: `hi${i}`,
        type: RenderType.Box,
        position: new Vector3(
          Math.random() * 2000 - 1000,
          Math.random() * 1000,
          Math.random() * 2000 - 1000
        ),
        scale: new Vector3(
          Math.random() * size,
          Math.random() * size,
          Math.random() * size
        ),
        color: this.randomHexColor(),
      });
    }
    return objects;
  }

  randomHexColor(): string {
    const value = Math.floor(Math.random() * 0xffffff);
    const hexString = String(value.toString(16)).padEnd(6, "F");
    return `#${hexString}`;
  }
}
