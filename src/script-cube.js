import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

let mixers = {
  left: null,
  middle: null,
  right: null,
};

let animations = {};
let activeAnimation;

// CUBE 1
gltfLoader.load("cube-basic-animation.glb", (gltf) => {
  scene.add(gltf.scene);

  mixers.middle = new THREE.AnimationMixer(gltf.scene);

  console.log(gltf.animations);

  animations = {
    idle: gltf.animations[0],
    click: gltf.animations[1],
    win: gltf.animations[2],
  };

  activeAnimation = animations.idle;

  window.addEventListener("click", () => {
    mixers.middle.clipAction(activeAnimation).stop();

    if (activeAnimation === animations.idle) {
      activeAnimation = animations.win;
    } else {
      activeAnimation = animations.idle;
    }
  });
});

// CUBE 2
gltfLoader.load("cube-basic-animation2.glb", (gltf) => {
  gltf.scene.position.x = -5;
  scene.add(gltf.scene);

  console.log(gltf);

  mixers.left = new THREE.AnimationMixer(gltf.scene);
});

// CUBE 3
gltfLoader.load("cube-basic-animation2.glb", (gltf) => {
  gltf.scene.position.x = 5;
  scene.add(gltf.scene);

  mixers.right = new THREE.AnimationMixer(gltf.scene);
});

// Lights

const light = new THREE.PointLight(0xffffff, 3);
light.position.x = 0;
light.position.y = 5;
light.position.z = 20;
scene.add(light);

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

  if (mixers.middle) {
    mixers.middle.update(delta);
    mixers.middle.clipAction(activeAnimation).play();
  }
  if (mixers.left) {
    mixers.left.update(delta);
    mixers.left.clipAction(animations.idle).play();
  }
  if (mixers.right) {
    mixers.right.update(delta);
    mixers.right.clipAction(animations.idle).play();
  }

  renderer.render(scene, camera);
};

tick();
