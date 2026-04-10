import * as THREE from "https://unpkg.com/three@0.163.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.163.0/examples/jsm/loaders/GLTFLoader.js";


// =====================
// 1. 场景
// =====================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);


// =====================
// 2. 摄像机
// =====================
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 4);


// =====================
// 3. 渲染器
// =====================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// =====================
// 4. 灯光（保证可见）
// =====================
scene.add(new THREE.AmbientLight(0xffffff, 1));


const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);


// =====================
// 5. 测试物体
// =====================
const testCube = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshStandardMaterial({ color: "red" })
);
testCube.position.set(-1.5, 0, 0);
scene.add(testCube);


// =====================
// 6. GLB 加载
// =====================
const loader = new GLTFLoader();


console.log("开始加载 GLB...");


loader.load(
  "./pearl.glb", //
  function (gltf) {
    console.log("✅ GLB 加载成功");


    const model = gltf.scene;


    // 让模型居中
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);


    // 自动缩放（防止太大或太小）
    const size = box.getSize(new THREE.Vector3()).length();
    const scale = 2 / size;
    model.scale.set(scale, scale, scale);


    scene.add(model);


    // 摄像机对准模型
    camera.lookAt(0, 0, 0);
  },
  undefined,
  function (error) {
    console.error("❌ 加载失败:", error);
  }
);


// =====================
// 7. 渲染循环
// =====================
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();


// =====================
// 8. 自适应
// =====================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
