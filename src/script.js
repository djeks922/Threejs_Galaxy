import "./style.css";
import gsap from 'gsap';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import * as dat from "dat.gui";
import { AdditiveBlending } from "three";
// console.log(THREE)

const gui = new dat.GUI();

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

// scene.background= '0xffffff'

//  Texture
const textureLoader = new THREE.TextureLoader();

const star1 = textureLoader.load("/assets/octagon.jpg");
// star1.minFilter = THREE.NearestMipmapNearestFilter

const sunTexture = textureLoader.load("/assets/mirvari.png");

// Font Loader
const loader = new THREE.FontLoader();

/*
 * Galaxy
 */



const parameters = {};

parameters.count = 10000;
parameters.size = 0.189;
parameters.radius = 2.55;
parameters.branches = 1;
parameters.branchHeight = 15;

parameters.spin = 3;
parameters.randomness = 0;
parameters.randomnessPower = 2;



parameters.insideColor = "#5c5a61";

parameters.outsideColor = "#000000";


parameters.near = 1;
parameters.far = 100;

parameters.intensity = 1;

parameters.y =  -7 ;
parameters.x =  -2.5 ;
parameters.z =  0 ;


let Galaxy = null;

let points = null;

let points2 = null;

let geometry = null;
let geometry2 = null;
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

  // Galaxy.add(sun);

  

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
    text.position.y += 0.9;
    text.position.z += -0.5;
    text.rotation.x = 0.9;

    // Galaxy.add(text);
  });

  if (points != null || points2 != null) {
    geometry.dispose();
    geometry2.dispose();
    material.dispose();
    Galaxy.remove(points);
    Galaxy.remove(points2)
  }

  /*
   *  Points Geometry
   */

  geometry = new THREE.BufferGeometry();
  geometry2 = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const positions2 = new Float32Array(parameters.count * 3);

  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    // position for each point
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius
    

    const branchAngle =
      ((i % (parameters.count/parameters.branches)) / (parameters.count/parameters.branches)) * Math.PI * 2;
    // const spinAngle = radius * parameters.spin;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness * radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness * radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness * radius;
    
    
    positions[i3] =  Math.sin( branchAngle ) * radius + randomX;
    positions[i3 + 1] = (Math.tan(i%(parameters.count/parameters.branches)/(parameters.count/parameters.branches) * Math.PI * 0.25) + Math.floor(i/(parameters.count/parameters.branches)))* parameters.branchHeight;
    positions[i3 + 2] = Math.cos(branchAngle ) * radius + randomZ;

    positions2[i3] = - Math.sin( branchAngle ) * radius + randomX;
    positions2[i3 + 1] = (Math.tan(i%(parameters.count/parameters.branches)/(parameters.count/parameters.branches) * Math.PI * 0.25) + Math.floor(i/(parameters.count/parameters.branches)))* parameters.branchHeight;
    positions2[i3 + 2] = - Math.cos(branchAngle ) * radius + randomZ;


    // if( i == 99999) console.log(i, positions[i3 + 1])
    /**
     *  version 1
     */
    // positions[i3] =  Math.sin((branchAngle+spinAngle) * Math.PI*2)*radius;
    // positions[i3 + 1] = Math.tan((Math.random()-0.5) * Math.PI*0.5 );
    // positions[i3 + 2] = Math.cos((branchAngle+spinAngle)* Math.PI*2)*radius;

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


  geometry2.setAttribute('position', new THREE.BufferAttribute(positions2,3));
  geometry2.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  /**
   * Material
   */

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    map: sunTexture,
    alphaMap: star1,
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    blending: AdditiveBlending

  });

  /**
   * Points
   */
  points = new THREE.Points(geometry, material);

  points2 = new THREE.Points(geometry2, material);
  points.position.set(parameters.x,parameters.y,parameters.z);
  points2.position.set(parameters.x,parameters.y,parameters.z)


  Galaxy.add(points);
  Galaxy.add(points2)
};


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
  .max(0.5)

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

  .min(1)

  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branchHeight")
  .min(1)
  .max(50)
  .step(0.5)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(25)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(5)
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
gui
  .add(parameters, "y")
  .min(-100)
  .max(100)
  .step(0.5)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "x")
  .min(-100)
  .max(100)
  .step(0.5)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "z")
  .min(-100)
  .max(100)
  .step(0.5)
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
  55,
  sizes.width / sizes.height,
  0.001,
  1000
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 6;


// Galaxy.add(camera);

/**
 *  Controls
 */

const controls = new OrbitControls(camera, canvas);


controls.enableDamping = true; // smooth performance
controls.enableZoom = false;
// controls.autoRotate = true;
// controls.dampingFactor = 0.1
controls.update()


generateGalaxy();


/**
 *  Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
renderer.setClearColor( '#1f1f27', 1 );



/**
 *  Wheel event for particle animation axis Y
 */
canvas.onwheel = (event) => { 
  if(event.deltaY < 0){
    // console.log(event.deltaY)
    gsap.to(points.position,{ duration:1, y: (points.position.y + 1)})
    gsap.to(points2.position,{ duration:1, y: (points.position.y + 1)})
    gsap.to(points.rotation,{ duration:1, y: (points.rotation.y + 1)})
    gsap.to(points2.rotation,{ duration:1, y: (points2.rotation.y + 1)})
  }
  if(event.deltaY > 0){
    // console.log(event.deltaY)
    gsap.to(points.position,{ duration:1, y: (points.position.y - 1)})
    gsap.to(points2.position,{ duration:1, y: (points.position.y - 1)})
    gsap.to(points.rotation,{ duration:1, y: (points.rotation.y - 1)})
    gsap.to(points2.rotation,{ duration:1, y: (points2.rotation.y - 1)})
  }
};
/**
 *  Animation function (loop)
 */
const clock = new THREE.Clock();
const refresh = () => {
  const elapsedTime = clock.getElapsedTime();
  /**
   *  Sun animation
   */

  // sun.rotation.x = Math.sin(elapsedTime / 5);
  // sun.rotation.y = Math.cos(elapsedTime / 5);

  // points.rotation.x = Math.sin(elapsedTime / 500);


  /**
   *  Points animation
   */
  points.rotation.y -= 0.0003;
  points2.rotation.y -=  0.0003;
 /**
  *  Controls updates
  */

  controls.update();


  /**
   *  update renderer 
    */ 
  
  renderer.render(scene, camera);

  /** 
   *  call refresh
   */ 
  window.requestAnimationFrame(refresh);
};

refresh();
