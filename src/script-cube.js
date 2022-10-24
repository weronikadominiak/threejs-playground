import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

let mixer;

let animations = {};
let activeAnimation;

gltfLoader.load("cube-basic-animation.glb", (gltf) => {
  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);

  console.log(gltf.animations);

  animations = {
    idle: gltf.animations[0],
    click: gltf.animations[1],
    win: gltf.animations[2],
  };

  console.log(gltf);

  activeAnimation = animations.idle;

  window.addEventListener("click", () => {
    mixer.clipAction(activeAnimation).stop();
    console.dir(mixer.clipAction(activeAnimation));

    if (activeAnimation === animations.idle) {
      activeAnimation = animations.win;
    } else {
      activeAnimation = animations.idle;
    }
  });
});

// Lights

const light = new THREE.PointLight(0xffffff, 1.5);
light.position.x = 0;
light.position.y = 10;
light.position.z = 20;
light.castShadow = true;
scene.add(light);

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 5;
camera.position.z = 15;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  requestAnimationFrame(tick);

  var delta = clock.getDelta();

  if (mixer) {
    mixer.update(delta);
    mixer.clipAction(activeAnimation).play();
  }

  renderer.render(scene, camera);
};

tick();
