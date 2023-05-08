import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './style.css';

// DATGUI
const gui = new dat.GUI({ closed: true });

// CANVAS
const canvas = document.querySelector('.webgl');
const sizes = { height: window.innerHeight, width: window.innerWidth };

// SCENE
const scene = new THREE.Scene();

// TEST CUBE
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
camera.position.set(2, 2, 5);
controls.update();

// RESIZING OF WINDOW
window.addEventListener('resize', () => {
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;

  renderer.setSize(sizes.width, sizes.height);
});

// RENDERER
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// ANIMATION
const clock = new THREE.Clock();

const tick = () => {
  requestAnimationFrame(tick);

  mesh.rotation.y += 0.001;

  renderer.render(scene, camera);
};

tick();
