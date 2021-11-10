import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import * as dat from "dat.gui";
// console.log(THREE)

const gui = new dat.GUI();

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();


//  Texture
const textureLoader = new THREE.TextureLoader()
const star1 = textureLoader.load("/assets/star_08.png")
const sunTexture = textureLoader.load("/assets/2k_sun.jpg")

/*
 * Galaxy
 */

const parameters = {};
parameters.count = 20000;

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {  
//   creating galaxy  
  const Galaxy = new THREE.Group()
  scene.add(Galaxy)


//   creating sun

// Sun Geometry
  const sunGeometry = new THREE.SphereGeometry( 0.5, 64, 32 );
//  Sun Material  
  const sunMaterial = new THREE.MeshBasicMaterial( { map: sunTexture, transparent: true} );

// Sun  
  const sun = new THREE.Mesh( sunGeometry, sunMaterial );
  sun.position.y = -0.45
  Galaxy.add(sun)

//  creating textBuffer

// Text geometry
 const textGeometry = new THREE.TextBufferGeometry()  
    
  if (points != null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  /*
   *  Geometry
   */

  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  // const colors = new Float32Array(parameters.)

  for (let i = 0; i < parameters.count; i++) {
    // const i3 = i * 3

    positions[i] = (Math.random() -0.5) * 4;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  /**
   * Material
   */

  material = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: star1,
    depthWrite: false
  });

  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  scene.add(points);
};
gui
  .add(parameters, "count")
  .min(100)
  .max(100000)
  .step(100)
  .onFinishChange(generateGalaxy);
generateGalaxy();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1;
scene.add(camera);

// controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // smooth performance

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// animation function (refresh rate )

const clock = new THREE.Clock();

const refresh = () => {
  const elapsedTime = clock.getElapsedTime();

  // update renderer
  renderer.render(scene, camera);

  // call refresh
  window.requestAnimationFrame(refresh);
};

refresh();
