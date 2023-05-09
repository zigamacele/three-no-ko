import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './style.css';

// DATGUI
const gui = new dat.GUI({});

// TEXTURE LOADER
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('textures/matcaps/7.png');

// CANVAS
const canvas = document.querySelector('.webgl');
const sizes = { height: window.innerHeight, width: window.innerWidth };

// SCENE
const scene = new THREE.Scene();

// MODEL LOADER
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const glftLoader = new GLTFLoader();
glftLoader.setDRACOLoader(dracoLoader);

glftLoader.load('models/heart.glb', (geometry) => {
  const model = geometry.scene;
  // const material = new THREE.MeshStandardMaterial({ color: '#fff000' });
  // model.children[0].material.color = new THREE.Color(0xff0000);
  model.children[0].material.matcap = matcapTexture;
  scene.add(model);
  console.log(geometry.scene);
});

//LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 1);
directionalLight.position.set(10, 5, 10);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 5, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotlight = new THREE.SpotLight(0x78ff00, 5, 10, Math.PI * 0.1, 0.25, 1);
spotlight.position.set(10, 10, 10);
scene.add(spotlight);

spotlight.target.position.x = -0.75;
scene.add(spotlight.target);

//helpers

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  1
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(spotLightHelper);

// FLOOR
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
camera.position.set(-8, 4, 8);
controls.update();

// RESIZING OF WINDOW
window.addEventListener('resize', () => {
  //UPDATE SIZES
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;

  //UPDATE CAMERA
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // UPDATE RENDERER
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// RENDERER
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ANIMATION
const clock = new THREE.Clock();

const tick = () => {
  // UPDATE CONTROLS
  controls.update();

  // RENDER
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
