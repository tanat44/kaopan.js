// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import {
  AmbientLight,
  BoxGeometry,
  Clock,
  Color,
  GridHelper,
  MOUSE,
  Mesh,
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

export type TickCallback = (dt: number) => void;

export class Engine {
  container: HTMLElement;
  assets: Assets;
  mouseHandler: MouseHandler;
  renderManager: RenderManager;

  // Threejs
  scene: Scene;
  camera: PerspectiveCamera;
  raycaster: Raycaster;
  renderer: WebGLRenderer;
  orbitControl: OrbitControls;

  // animation loop
  clock: Clock;
  tickCallbacks: TickCallback[];

  constructor(canvasId: string) {
    this.assets = new Assets(this);
    this.renderManager = new RenderManager(this);

    this.raycaster = new Raycaster();
    this.setupScene(canvasId);
    this.setupLighting();
    this.setupOrbitControl();
    this.tickCallbacks = [];
    this.mouseHandler = new MouseHandler(canvasId, this);

    const objs = this.generateObjects();
    this.renderManager.updateObject(objs);
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
  }

  tick() {
    const dt = this.clock.getDelta();
    this.tickCallbacks.map((fn) => fn(dt));
    this.render();
  }

  registerTickCallback(callback: TickCallback) {
    this.tickCallbacks.push(callback);
  }

  setupOrbitControl() {
    this.orbitControl = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControl.damping = 0.2;
    this.orbitControl.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      RIGHT: MOUSE.PAN,
    };
    this.orbitControl.addEventListener("change", () => this.render());
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

  generateObjects() {
    const objects: RenderObject[] = [];
    for (let i = 0; i < 1000; ++i) {
      objects.push({
        name: `hi${i}`,
        type: RenderType.Box,
        position: new Vector3(
          Math.random() * 1000,
          Math.random() * 1000,
          Math.random() * 1000
        ),
        scale: new Vector3(
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        ),
        color: this.randomHexColor(),
      });
    }
    return objects;
  }

  randomHexColor(): string {
    const value = Math.floor(Math.random() * 0xffffff);
    return `#${value.toString(16)}`;
  }

  clear() {}
  zoomFit() {}
  destroy() {}
}
