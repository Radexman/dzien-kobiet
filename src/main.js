import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

// Canvas
const canvas = document.getElementById('webgl');

// Scene
const scene = new THREE.Scene();

// Models
const gltfLoader = new GLTFLoader();

// Flower
gltfLoader.load(
	'/assets/models/flower.glb',
	(gltf) => {
		gltf.scene = gltf.scene;

		gltf.scene.traverse((child) => {
			child.intensity = 80;
		});
		gltf.scene.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
				child.material.emissive = new THREE.Color(0x000000);
			}
		});

		gltf.scene.rotation.y = Math.PI * 0.5;
		gltf.scene.position.set(0.575, 0.759, -0.409);
		gltf.scene.scale.set(0.08, 0.08, 0.08);

		scene.add(gltf.scene);
	},
	undefined,
	(error) => console.error('Error loading model:', error)
);

// Desk
gltfLoader.load(
	'/assets/models/desk.glb',
	(gltf) => {
		gltf.scene.traverse((child) => {
			child.intensity = 80;
		});
		gltf.scene.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		scene.add(gltf.scene);
	},
	undefined,
	(error) => console.error('Error loading model:', error)
);

// Light
const directionalLight = new THREE.DirectionalLight(0xffcc99, 8);
directionalLight.position.set(12, 12, 4);
directionalLight.castShadow = true;
directionalLight.shadow.normalBias = 0.027;
directionalLight.shadow.bias = -0.004;
scene.add(directionalLight);

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// Resize
window.addEventListener('resize', () => {
	// Update size
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

// Camera group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0.5, 1.01, 0.66);

cameraGroup.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor('#1e1a20');
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;

// Cursur
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener('mousemove', (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = event.clientY / sizes.height - 0.5;
});

// Text animation
gsap.from('h1', {
	opacity: 0,
	y: -75,
	duration: 1.5,
	ease: 'power2.out',
});

gsap.from('p', {
	opacity: 0,
	x: -75,
	duration: 1.5,
	delay: 0.3,
	ease: 'power2.out',
});

// Animate
const clock = new THREE.Clock();
let previousTime = 0;

const animate = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	// Camera parralax aniamtion
	const paralaxX = cursor.x * 0.5;
	const paralaxY = cursor.y * 0.5;
	cameraGroup.position.x += (paralaxX - cameraGroup.position.x) * 0.2 * deltaTime;
	cameraGroup.position.y += (paralaxY - cameraGroup.position.y) * 0.2 * deltaTime;

	renderer.render(scene, camera);
	window.requestAnimationFrame(animate);
};

animate();
