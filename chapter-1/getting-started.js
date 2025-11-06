// 引入Three
import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
// 基本场景设置
// 1.创建场景(容器)
const scene = new THREE.Scene();
const stats = Stats()
// 设置场景背景色
scene.background = new THREE.Color(0xffffff);
// 设置雾化效果
scene.fog = new THREE.Fog(0xffffff, 0.0025, 50);
// 2.创建相机(视角) 参数：视角，宽高比，近裁切面，远裁切面
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 设置相机具体位置
camera.position.set(-3, 2, 8);
// camera.position.set(0, 8, 0);
// camera.lookAt(0, 0, 0); // 让相机看向场景中心
// 3. 设置渲染器并附着到画布上
const renderer = new THREE.WebGLRenderer({ antialias: true });
// 设置渲染输出的颜色编码为sRGB色彩空间
renderer.outputColorSpace = THREE.SRGBColorSpace;
// 启用阴影映射系统
renderer.shadowMap.enabled = true;
// 设置阴影映射算法为VSM（Variance Shadow Map）
renderer.shadowMap.type = THREE.VSMShadowMap;
// 设置渲染器的输出尺寸匹配浏览器窗口大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 设置渲染器的背景清除颜色为白色
renderer.setClearColor(0xffffff);
// 将渲染器的canvas元素添加到网页body中
document.body.appendChild(renderer.domElement, stats.dom);

// 添加灯光
scene.add(new THREE.AmbientLight(0x666666));

const dirLight = new THREE.DirectionalLight(0xaaaaaa);
// dirLight.position.set(0, 12, 0);
// dirLight.position.set(5, 12, 8);
// 基础场景-定向光影
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 20;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.bias = -0.0001;
// 性能优化-定向光影
// dirLight.shadow.mapSize.width = 1024;
// dirLight.shadow.mapSize.height = 1024;
// dirLight.shadow.camera.near = 0.1;
// dirLight.shadow.camera.far = 30;
// dirLight.shadow.camera.top = 15;
// dirLight.shadow.camera.bottom = -15;
// dirLight.shadow.camera.left = -15;
// dirLight.shadow.camera.right = 15;
dirLight.castShadow = true;
// 重要：必须将灯光添加到场景中
scene.add(dirLight);

// 创建一个立方体和环面结，并将它们添加到场景中
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000FF });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -1;
cube.castShadow = true;
scene.add(cube);

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 100);
const torusKnotMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    roughness: 0.1,
});
const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, torusKnotMat);
torusKnotMesh.castShadow = true;
torusKnotMesh.position.x = 2;
scene.add(torusKnotMesh);

// 创建一个非常大的地平面
const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.position.set(0, -2, 0);
groundMesh.rotation.set(Math.PI / -2, 0, 0);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// 增加轨道控制器
const orbitControls = new OrbitControls(camera, renderer.domElement);
// 增加阻尼效果
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.05;

const gui = new GUI();

const props = {
    cubeSpeed: 0.01,
    torusSpeed: 0.01,
    cubeRotationX: true,
    cubeRotationY: true,
    cubeRotationZ: true,
    torusRotationX: true,
    torusRotationY: true,
    torusRotationZ: true,
    reset: () => {
        props.cubeSpeed = 0.01;
        props.torusSpeed = 0.01;
        gui.updateDisplay();
    }
};

// 添加速度控制
gui.add(props, 'cubeSpeed', -0.2, 0.2, 0.01).name('立方体速度');
gui.add(props, 'torusSpeed', -0.2, 0.2, 0.01).name('环面结速度');

// 添加旋转轴控制
gui.add(props, 'cubeRotationX').name('立方体X轴');
gui.add(props, 'cubeRotationY').name('立方体Y轴');
gui.add(props, 'cubeRotationZ').name('立方体Z轴');

gui.add(props, 'torusRotationX').name('环面结X轴');
gui.add(props, 'torusRotationY').name('环面结Y轴');
gui.add(props, 'torusRotationZ').name('环面结Z轴');

// 重置按钮
gui.add(props, 'reset').name('重置参数');

// 修改动画函数
let step = 0;
// 添加动画
function animate() {
    // 保持轨道控制器更新
    orbitControls.update();
    stats.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    step += 0.04;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // cube.position.x = 4 * (Math.cos(step));
    // cube.position.y = 4 * Math.abs(Math.sin(step));
    cube.rotation.z += 0.01;
    torusKnotMesh.rotation.x -= 0.01;
    torusKnotMesh.rotation.y += 0.01;
    torusKnotMesh.rotation.z -= 0.01;

    // 立方体旋转
    if (props.cubeRotationX) cube.rotation.x += props.cubeSpeed;
    if (props.cubeRotationY) cube.rotation.y += props.cubeSpeed;
    if (props.cubeRotationZ) cube.rotation.z += props.cubeSpeed;

    // 环面结旋转
    if (props.torusRotationX) torusKnotMesh.rotation.x -= props.torusSpeed;
    if (props.torusRotationY) torusKnotMesh.rotation.y += props.torusSpeed;
    if (props.torusRotationZ) torusKnotMesh.rotation.z -= props.torusSpeed;
}

animate();

