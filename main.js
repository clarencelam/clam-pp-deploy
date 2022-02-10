import './style.css'

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas:document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);


renderer.render(scene,camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

//scene.add(torus);
torus.position.z = 0;
torus.position.x = 0;

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers
//const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200,50);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);


function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new  THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);
}

let numstars = 100;

Array(numstars).fill().forEach(addStar);

// Background
const spaceTexture = new THREE.TextureLoader().load('astronomy.jpg');
scene.background = spaceTexture;

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

// Function to move camera in 3d enviornment 
function moveCamera(){
  const t = document.body.getBoundingClientRect().top;

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;


  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

}
moveCamera()


// Function to show hidden items on scroll

/* BAD CODE
const scrollOffset = 100;
const scrollElement = document.querySelector(".js-scroll");

scrollElements.forEach((el)=>{
  el.style.opacity = 0;
})

const elementInView = (el, offset=0) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop <= 
    ((window.innerHeight || document.documentElement.clientHeight) - offset)
  );
};

const displayScrollElement = () => {
  scrollElement.classList.add('scrolled');
}

const handleScrollAnimation = () => {
  if (elementInView(scrollElement, scrollOffset)) {
      displayScrollElement();
  } 
}
*/

const scrollElements = document.querySelectorAll(".js-scroll");

scrollElements.forEach((el) => {
  el.style.opacity = 0
})

const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
};

const displayScrollElement = (element) => {
  element.classList.add("scrolled");
  element.style.opacity = 1;
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) {
      displayScrollElement(el);
    } 
  })
}

// Code for scroll dissapear feature 
// to code

window.addEventListener("scroll", () => { 
  handleScrollAnimation();
});


// Function to handle sticky navbar

function stickyNav(){
  if(window.pageYOffset >= sticky){
    navbar.classList.add("sticky");
    console.log("pastnav")
  } else{
    navbar.classList.remove("sticky")
    console.log("not past nav")
  }
}


// Function to apply auto-scroll until navbar sticks to top, upon loading the page

function scrollPage(){
  window.scrollBy(0, 1);
}

function stopScroll(){
    clearTimeout(delayScroll)
}

var scrollflag = false; // var so we only trigger the scroll setTimeout once, when the page loads

function autoScroll(){
  if(window.pageYOffset >= sticky){
    scrollflag = true; // Stops autoscroll from re-applying after its first ran upon load. So the user can scroll back to top without autoscroll applying.
  }
  else if(window.pageYOffset < sticky && scrollflag === false ){
    delayScroll = setTimeout(scrollPage, 20)
    scrollflag = true;
  } else{
    stopScroll()
  }
}



// Function to accumulate functions that need to occur on scroll

function onScrollActions(){
  moveCamera();
  stickyNav();
}

document.body.onscroll = onScrollActions;


// Animation loop / gameloop
function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // controls.update();

  renderer.render(scene,camera);
  autoScroll()
}
animate();




/*


function stickyNav (){
  if(window.pageYOffset >= menu.offsetTop){
    navbar.classList.add("sticky");
    console.log("heyo")
  }
  else{
    navbar.classList.remove("sticky")
  }
}



Auto Scroll

let autoscroll = false;

function toggleScroll(){
  if(autoscroll === false){
    autoscroll = true;
  } else{
    autoscroll = false;
  }
}

function pageScroll() {
  if(autoscroll === true){
    window.scrollBy(0,1);
    scrolldelay = setTimeout(pageScroll,10);  
  } else{
    //
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('startscroll');
  if (btn) {
    btn.addEventListener('click', toggleScroll());
  }
});

pageScroll()
*/
