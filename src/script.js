import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './style.css';

// DATGUI
const gui = new dat.GUI({});
gui.closed = true;

// PARAMETERS
const parameters = {
  count: 100,
  materialColor: '#ffeded',
  randomColors: ['#d13d65', '#7fadca', '#f5ee53', '#ffeded'],
  childPosition: { x: 500, y: 30, z: 30 },
};

// TEXTURE LOADER
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradient/5.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
  color: parameters.randomColors[Math.random() * 4],
  gradientMap: gradientTexture,
});

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

// FLOW
let flowGroup = null;
const generateFlow = () => {
  if (flowGroup !== null) {
    scene.remove(flowGroup);
  }

  flowGroup = new THREE.Group();
  flowGroup.rotation.z = -Math.PI * 0.05;
  const count = parameters.count;

  // usagi
  glftLoader.load('models/usagi.glb', (gltf) => {
    for (let index = 0; index < count; index++) {
      const child = gltf.scene.children[0].clone();
      const randomScale = Math.random() * 0.5;
      child.material = new THREE.MeshToonMaterial({
        color: parameters.randomColors[Math.round(Math.random() * 4)],
        gradientMap: gradientTexture,
      });
      child.position.set(
        (Math.random() - 0.5) * parameters.childPosition.x,
        (Math.random() - 0.5) * parameters.childPosition.y,
        (Math.random() - 0.5) * parameters.childPosition.z
      );
      child.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      child.scale.set(randomScale, randomScale, randomScale);
      flowGroup.add(child);
    }
  });

  // star
  glftLoader.load('models/star.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = material;
    });
    flowGroup.add(gltf.scene);
  });

  // heart
  glftLoader.load('models/heart.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = material;
    });
    flowGroup.add(gltf.scene);
  });

  scene.add(flowGroup);
};

generateFlow();

gui
  .add(parameters.childPosition, 'x')
  .min(0)
  .max(1000)
  .step(1)
  .onFinishChange(generateFlow);
gui
  .add(parameters.childPosition, 'y')
  .min(0)
  .max(1000)
  .step(1)
  .onFinishChange(generateFlow);
gui
  .add(parameters.childPosition, 'z')
  .min(0)
  .max(1000)
  .step(1)
  .onFinishChange(generateFlow);

//LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
gui
  .add(ambientLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.001)
  .name('AmbLight Inte');

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);
gui
  .add(directionalLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.001)
  .name('DirLight Inte');

// FLOOR
// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(50, 50),
//   new THREE.MeshStandardMaterial({
//     color: '#444444',
//     metalness: 0,
//     roughness: 0.5,
//   })
// );
// floor.receiveShadow = true;
// floor.rotation.x = -Math.PI * 0.5;
// scene.add(floor);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
camera.position.set(0, 10, 120);
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
  const elapsedTime = clock.getElapsedTime();
  // UPDATE CONTROLS
  controls.update();

  // FLOW ROTATION
  for (const object of flowGroup.children) {
    const randomValue = Math.random() * 0.005;
    object.position.x += 0.03;
    object.rotation.z += randomValue;
    object.rotation.y += randomValue;
  }

  // LIGhT ROTATION
  directionalLight.position.x = Math.sin(clock.getElapsedTime());
  directionalLight.position.z = Math.cos(clock.getElapsedTime());

  // RENDER
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
