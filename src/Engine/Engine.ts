import {
  AmbientLight,
  Clock,
  Color,
  GridHelper,
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
import { CameraManager } from "../Camera/CameraManager";
import _ from "lodash";
import { CameraType } from "../Camera/types";
import { IAnimator } from "../Animation/IAnimator";
import { MaterialManager } from "../Material/MaterialManager";
import { Transformer } from "../Tool/Transformer";

export class Engine {
  container: HTMLElement;
  assets: Assets;
  materials: MaterialManager;
  mouseHandler: MouseHandler;
  renderer: RenderManager;
  transformer: Transformer;

  // Threejs
  scene: Scene;
  raycaster: Raycaster;
  webglRenderer: WebGLRenderer;
  stats: Stats;
  cameraManager: CameraManager;

  // animation loop
  clock: Clock;
  animators: Map<string, IAnimator>;

  constructor(canvasId: string) {
    this.animators = new Map();
    this.assets = new Assets(this);
    this.raycaster = new Raycaster();
    this.setupScene(canvasId);
    this.cameraManager = new CameraManager(this, CameraType.Perspective);
    this.setupLighting();
    this.mouseHandler = new MouseHandler(canvasId, this);
    this.setupGrid();
    this.materials = new MaterialManager();
    this.renderer = new RenderManager(this);
    this.transformer = new Transformer(this);

    // render test objects
    const num = 1000;
    document.getElementById("info").innerHTML = `instanced mesh count: ${num}`;
    const objs = this.generate2DObjects(num);
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
    this.container = document.getElementById(canvasId);
    this.scene = new Scene();
    this.scene.background = new Color(0xf0f0f0);

    // setup webgl container
    this.webglRenderer = new WebGLRenderer({ antialias: true });
    this.webglRenderer.setPixelRatio(window.devicePixelRatio);
    this.webglRenderer.setSize(this.width, this.height);
    this.webglRenderer.shadowMap.enabled = true;
    this.clock = new Clock();
    this.webglRenderer.setAnimationLoop(() => this.tick());
    this.container.appendChild(this.webglRenderer.domElement);

    // add statistic
    this.stats = new Stats();
    this.container.appendChild(this.stats.dom);

    window.addEventListener(
      "resize",
      _.debounce(() => {
        this.onResize();
      }, 500)
    );
  }

  get width() {
    return this.container.offsetWidth;
  }

  get height() {
    return this.container.offsetHeight;
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

    if (this.animators) {
      const dt = this.clock.getDelta();
      this.animators.forEach((animator, key) => {
        animator.tick(dt);
      });
    }
    this.render();
  }

  addAnimator(objectName: string, animator: IAnimator) {
    this.animators.set(objectName, animator);
  }

  removeAnimator(objectName: string) {
    const animator = this.animators.get(objectName);
    if (!animator) return;

    this.animators.delete(objectName);
  }

  onResize() {
    if (!this.cameraManager) {
      return;
    }
    const width = this.width;
    const height = this.height;
    this.cameraManager.onResize(width, height);
    this.webglRenderer.setSize(width, height);
    this.render();
  }

  render() {
    if (!this.cameraManager) {
      return;
    }
    this.webglRenderer.render(this.scene, this.cameraManager.currentCamera);
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

  generate2DObjects(number: number) {
    const objects: RenderObject[] = [];
    for (let i = 0; i < number; ++i) {
      const rect: RenderObject = {
        name: `rect_${i}`,
        type: RenderType.Rectangle,
        gpuInstancing: true,
        position: new Vector3(
          Math.random() * 2000 - 1000,
          0,
          Math.random() * 2000 - 1000
        ),
        scale: new Vector3(30, 1, 30),
        color: "#78b522",
      };
      objects.push(rect);
    }
    return objects;
  }

  randomHexColor(): string {
    const value = Math.floor(Math.random() * 0xffffff);
    const hexString = String(value.toString(16)).padEnd(6, "F");
    return `#${hexString}`;
  }
}
