import * as THREE from "three";
import { BoxGeometry, CylinderGeometry, InstancedMesh } from "three";
import { Engine } from "./Engine";
import { LineBasicMaterialLibrary } from "../Material/LineBasicMaterialLibrary";
import { MeshBasicMaterialLibary } from "../Material/MeshBasicMaterialLibrary";

export class Assets {
  engine: Engine;

  // geometry
  cubeGeometry: BoxGeometry;
  cylinderGeo: CylinderGeometry;
  planeGeo: THREE.PlaneGeometry;
  circleGeo: THREE.CircleGeometry;

  // mesh
  planeMeshes: InstancedMesh;
  planeMeshIndex: number;

  constructor(engine: Engine) {
    this.engine = engine;

    // geometry
    this.cubeGeometry = new BoxGeometry(1, 1, 1);
    this.cylinderGeo = new CylinderGeometry(1, 1, 1);
    this.planeGeo = new THREE.PlaneGeometry(1, 1);
    this.circleGeo = new THREE.CircleGeometry(1, 32);

    // material
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    planeGeometry.rotateX(-Math.PI / 2);

    //mesh
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    material.depthWrite = false;
    this.planeMeshes = new InstancedMesh(this.planeGeo, material, 20000);
    this.planeMeshIndex = 0;
  }

  createBufferGeometry() {
    const geometry = new THREE.BufferGeometry();

    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array([
      -1.0,
      -1.0,
      1.0, // v0
      1.0,
      -1.0,
      1.0, // v1
      1.0,
      1.0,
      1.0, // v2
      -1.0,
      1.0,
      1.0, // v3
    ]);

    const indices = [0, 1, 2, 2, 3, 0];

    geometry.setIndex(indices);

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(100, 100, 100);
  }

  setupAttributes(geometry: THREE.BufferGeometry) {
    geometry.deleteAttribute("uv");
    geometry.deleteAttribute("normal");

    const vectors = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
    ];

    const position = geometry.attributes.position;
    const centers = new Float32Array(position.count * 3);

    for (let i = 0; i < position.count; i++) {
      vectors[i % 3].toArray(centers, i * 3);
    }
    console.log(vectors[0].toArray());

    geometry.setAttribute("center", new THREE.BufferAttribute(centers, 3));
  }
}
