import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import * as dat from "dat.gui";
// console.log(THREE)

const gui = new dat.GUI();

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

//  Texture
const textureLoader = new THREE.TextureLoader();
const star1 = textureLoader.load("/assets/star_07.png");
const sunTexture = textureLoader.load("/assets/2k_sun.jpg");

// Font Loader

const loader = new THREE.FontLoader();

/*
 * Galaxy
 */



const parameters = {};
parameters.count = 200000;
parameters.size = 0.009;
parameters.radius = 10;
parameters.branches = 15;
parameters.spin = 3;
parameters.randomness = 5;
parameters.randomnessPower = 2;

parameters.insideColor = "#ff00ff";
parameters.outsideColor = "#00ffff";

parameters.near = 1;
parameters.far = 100;

parameters.intensity = 1;

let Galaxy = null;

let points = null;
let geometry = null;
let material = null;

let sun = null;
let sunGeometry = null;
let sunMaterial = null;

let light = null;
let directionalLight = null;
const generateGalaxy = () => {
  //   creating galaxy
  if (Galaxy != null) {
    scene.remove(Galaxy);
    Galaxy.remove(light)
  }
  Galaxy = new THREE.Group();
  scene.add(Galaxy);

  // Galaxy Lights
  light = new THREE.PointLight(0xffffff, parameters.near, parameters.far);
  directionalLight = new THREE.AmbientLight(0xffffff, parameters.intensity);
  Galaxy.add(directionalLight,light);
  light.position.y = 2

  //   creating sun
  if (sun != null) {
    sunGeometry.dispose();
    sunMaterial.dispose();
    Galaxy.remove(sun);
  }
  // Sun Geometry
  sunGeometry = new THREE.SphereGeometry(0.5, 64, 32);
  //  Sun Material
  sunMaterial = new THREE.MeshStandardMaterial({
    map: sunTexture,
    transparent: true,
  });

  // Sun
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  // sun.position.y = -0.5;
  Galaxy.add(sun);
  

  //  creating textBuffer

  // Text geometry
  loader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new THREE.TextBufferGeometry("Claradix", {
      font: font,
      size: 0.15,
      height: 0.02,
      curveSegments: 52,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.002,
      bevelOffset: 0,
      bevelSegments: 15,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: "white" });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.center();
    text.position.y = 0.4;
    text.position.z = -0.8;
    // text.rotation.x = 0.2;

    Galaxy.add(text);
  });

  if (points != null) {
    geometry.dispose();
    material.dispose();
    Galaxy.remove(points);
  }

  /*
   *  Points Geometry
   */

  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    // position for each point
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius
    

    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const spinAngle = radius * parameters.spin;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness;
    // if( i< 20) console.log(branchAngle)
    positions[i3] =  Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = (radius < 2 ? Math.cos(radius*Math.PI*0.25)* 2 *(Math.random() < 0.5 ? 1 : -1) : 0) + randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Colors

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / (parameters.radius));

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  // console.log(geometry.getAttribute('position'))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  /**
   * Material
   */

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    alphaMap: star1,
    transparent: true,
    depthWrite: false,
    vertexColors: true,
  });

  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  Galaxy.add(points);
};
generateGalaxy();

/**
 *  GUI parameters
 */

gui
  .add(parameters, "count")
  .min(100)
  .max(10000000)
  .step(100)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomnessPower")
  .min(0)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);

gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

gui
  .add(parameters, "near")
  .min(0.01)
  .max(1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "far")
  .min(100)
  .max(1000)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "intensity")
  .min(0)
  .max(5)
  .step(0.01)
  .onFinishChange(generateGalaxy);

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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.001,
  1000
);
camera.position.x = 7;
camera.position.y = 3;
camera.position.z = 0;
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

  sun.rotation.x = Math.sin(elapsedTime / 5);
  sun.rotation.y = Math.cos(elapsedTime / 5);

  points.rotation.x = Math.sin(elapsedTime / 500);
  // points.rotation.y = Math.sin(elapsedTime / 500);
  points.rotation.z = Math.cos(elapsedTime / 500);

  // Galaxy.position.x+=elapsedTime/100000
  // Galaxy.position.y+=elapsedTime/100000
  // Galaxy.position.z+=elapsedTime/100000
  // camera.position.set(Math.sin(elapsedTime/5)*parameters.radius,Math.sin(elapsedTime/5)*parameters.radius+3,Math.sin(elapsedTime/5)*parameters.radius+2)
  // camera.lookAt(text.position)
  // update renderer

  renderer.render(scene, camera);

  // call refresh
  window.requestAnimationFrame(refresh);
};

refresh();
