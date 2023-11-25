import { Camera, MOUSE } from "three";
import { Engine } from "../Engine/Engine";
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { InteractionHandler } from "./InteractionHandler";
import { Select } from "./Select/Select";

const LEFT_BUTTON = 0;

export enum InteractionMode {
  Select,
  Transform,
}

export class Interaction {
  engine: Engine;
  orbitControl: OrbitControls;

  currentMode: InteractionMode;
  interactions: Map<InteractionMode, InteractionHandler>;

  constructor(engine: Engine) {
    this.engine = engine;
    this.setupOrbitControl();

    this.currentMode = InteractionMode.Select;
    this.interactions = new Map();
    this.interactions.set(InteractionMode.Select, new Select(this.engine));

    engine.element.addEventListener("mousedown", (e: MouseEvent) =>
      this.currentInteraction.onMouseDown(e)
    );
    engine.element.addEventListener("mousemove", (e: MouseEvent) =>
      this.currentInteraction.onMouseMove(e)
    );
    engine.element.addEventListener("mouseup", (e: MouseEvent) =>
      this.currentInteraction.onMouseUp(e)
    );
  }

  changeInteraction(newMode: InteractionMode) {
    this.currentInteraction.cleanup();
    this.currentMode = newMode;
  }

  get currentInteraction() {
    return this.interactions.get(this.currentMode);
  }

  setupOrbitControl() {
    this.orbitControl = new OrbitControls(
      this.engine.cameraManager.currentCamera,
      this.engine.webglRenderer.domElement
    );
    this.orbitControl.damping = 0.2;
    this.orbitControl.mouseButtons = {
      MIDDLE: MOUSE.ROTATE,
      RIGHT: MOUSE.PAN,
    };
    this.orbitControl.addEventListener("change", () => this.engine.render());
  }

  onCameraChange(newCamera: Camera) {
    this.orbitControl.camera = newCamera;
  }
}
