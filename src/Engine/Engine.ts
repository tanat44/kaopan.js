import { Clock, Vector3, WebGLRenderer } from "three";
// @ts-ignore
import _ from "lodash";
import Stats from "three/examples/jsm/libs/stats.module";
import { IAnimator } from "../Animation/IAnimator";
import { CameraManager } from "../Camera/CameraManager";
import { CameraType } from "../Camera/types";
import { RenderObject, RenderType } from "../Data/types";
import { Interaction } from "../Interaction/Interaction";
import { MaterialManager } from "../Material/MaterialManager";
import { RenderManager } from "../Render/Renderer";
import { Transformer } from "../Tool/Transformer";
import { SceneManager } from "./SceneManager";

export class Engine {
  element: HTMLElement;
  sceneManager: SceneManager;
  materials: MaterialManager;
  interaction: Interaction;
  renderer: RenderManager;
  transformer: Transformer;

  // Threejs
  webglRenderer: WebGLRenderer;
  stats: Stats;
  cameraManager: CameraManager;

  // animation loop
  clock: Clock;
  animators: Map<string, IAnimator>;

  constructor(canvasId: string) {
    this.element = document.getElementById(canvasId);
    this.sceneManager = new SceneManager(this);
    this.setupCanvas();
    this.cameraManager = new CameraManager(this, CameraType.Perspective);
    this.interaction = new Interaction(this);
    this.materials = new MaterialManager();
    this.renderer = new RenderManager(this);
    this.transformer = new Transformer(this);
    this.animators = new Map();

    // // render test objects
    const num = 1000;
    document.getElementById("info").innerHTML = `instanced mesh count: ${num}`;
    const objs = this.generateObjects(num);
    this.renderer.updateObject(objs);

    // createTestBasicObject(this)
    // createTestMeshLine(this);
    // createTestLineOutline(this);
    // createStroke(this);
  }

  setupCanvas() {
    // setup webgl container
    this.webglRenderer = new WebGLRenderer({ antialias: true });
    this.webglRenderer.setPixelRatio(window.devicePixelRatio);
    this.webglRenderer.setSize(this.width, this.height);
    this.webglRenderer.shadowMap.enabled = true;
    this.clock = new Clock();
    this.webglRenderer.setAnimationLoop(() => this.tick());
    this.element.appendChild(this.webglRenderer.domElement);

    // add statistic
    this.stats = new Stats();
    this.element.appendChild(this.stats.dom);

    window.addEventListener(
      "resize",
      _.debounce(() => {
        this.onResize();
      }, 500)
    );
  }

  get width() {
    return this.element.offsetWidth;
  }

  get height() {
    return this.element.offsetHeight;
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
    this.webglRenderer.render(
      this.sceneManager.scene,
      this.cameraManager.currentCamera
    );
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
