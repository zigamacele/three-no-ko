import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './style.css';

// DATGUI
const gui = new dat.GUI({});
gui.closed = true;
gui.hide = true;

// PARAMETERS
const parameters = {
  parCount: 1000,
  perSize: 3,
  parRadius: 500,
  count: 250,
  materialColor: '#ffeded',
  randomColors: ['#d13d65', '#7fadca', '#f5ee53', '#ffeded'],
  childPosition: { x: 500, y: 40, z: 30 },
};

const textSelector = document.querySelector('.fixed-text');

// LIGHT/DARK MODE
const lightMode = {
  modelColor: new THREE.Color(
    parameters.randomColors[Math.round(Math.random() * 4)]
  ),
  parColor: new THREE.Color('white'),
};
const darkMode = {
  modelColor: new THREE.Color('#39444e'),
  parColor: new THREE.Color('#ee3149'),
};

// TEXTURE LOADER
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('textures/particles/1.png');
const gradientTexture = textureLoader.load('textures/gradient/5.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

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

  // heart
  glftLoader.load('models/heart.glb', (gltf) => {
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

  scene.add(flowGroup);
};

generateFlow();

gui
  .add(parameters, 'count')
  .min(10)
  .max(500)
  .step(1)
  .onFinishChange(generateFlow);
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

// PARTICLES
const particlesGeometry = new THREE.BufferGeometry();
const count = parameters.parCount;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * parameters.parRadius;
  colors[i] = parameters.materialColor;
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
  alphaMap: particleTexture,
  transparent: true,
  size: parameters.perSize,
  sizeAttenuation: true,
  depthWrite: false,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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

// BACKDROP;
const backdrop = new THREE.Mesh(
  new THREE.PlaneGeometry(sizes.width, sizes.height),
  new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5,
  })
);
backdrop.receiveShadow = true;
backdrop.position.z = -500;
backdrop.position.y = -1000;
backdrop.rotation.x = Math.PI * 0.1;
scene.add(backdrop);

// CAMERA
const cameraGroup = new THREE.Group();
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 55);
cameraGroup.add(camera);
scene.add(cameraGroup);

// CURSOR
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

// SCROLL
let scrollY = window.scrollY;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

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
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(parameters.backgroundColor);
renderer.setClearColor(new THREE.Color('#d13d65'), 0);

// ANIMATION
const clock = new THREE.Clock();
const objectDistance = 4;
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // UPDATE CAMERA
  camera.position.y = (-scrollY / sizes.height) * objectDistance;

  const parallaxX = cursor.x * 5;
  const parallaxY = cursor.y * 5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  // UPDATE BACKDROP
  // console.log('BACKDROP', backdrop.position.y, 'SCREEN', sizes.height);
  backdrop.position.y = scrollY - sizes.height;

  // FLOW ROTATION
  for (const object of flowGroup.children) {
    const randomValue = Math.random() * 0.005;

    if (scrollY < sizes.height) {
      if (object.material.color.equals(darkMode.modelColor)) {
        textSelector.style.color = 'black';
        object.material.color = new THREE.Color(
          parameters.randomColors[Math.round(Math.random() * 4)]
        );
      }
      particles.material.color = new THREE.Color('white');
      object.position.x += 0.03;
      object.rotation.z += randomValue;
      object.rotation.y += randomValue;
    } else {
      textSelector.style.color = 'white';
      particles.material.color = darkMode.parColor;
      object.material.color = darkMode.modelColor;
      object.position.x -= 0.03;
      object.rotation.z -= randomValue;
      object.rotation.y -= randomValue;
    }
  }

  // PARTICLES SIZE
  particlesMaterial.size = Math.abs(Math.sin(clock.getElapsedTime()) + 0.5 * 3);

  // LIGhT ROTATION
  directionalLight.position.x = Math.sin(clock.getElapsedTime());
  directionalLight.position.z = Math.cos(clock.getElapsedTime());

  // RENDER
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
