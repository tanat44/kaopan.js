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
import { createTestInstanceLine } from "../Sandbox/TestInstanceLine";
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

    // render test objects
    createTestInstanceLine(this);
    // createTest3DTree(this, 1000);
    // createTestBasicObject(this)
    // createTestMeshLine(this);
    // createTestLineOutline(this);
    // createStroke(this);

    // const geometry = new LineGeometry();
    // const material = new MeshBasicMaterial({
    //   color: new Color("red"),
    //   side: DoubleSide,
    //   opacity: 1.0,
    //   transparent: true,
    // });
    // const mesh = new Mesh(geometry, material);
    // mesh.scale.set(100, 100, 100);
    // this.sceneManager.addObject(mesh, true);
    // console.log(this.sceneManager.scene);
    // this.render();
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

  updateScreenInto(text: string) {
    document.getElementById("info").innerHTML = text;
  }
}
