import GUI from "lil-gui";
import * as THREE from "three";
import { initScene } from '../bootstrap/bootstrap';
import { floatingFloor } from '../bootstrap/floor';
import { initializeHelperControls } from "../controls/helpers-control.js";
import { intializeRendererControls } from '../controls/renderer-control';
import { initializeSceneControls } from "../controls/scene-controls";
import { stats } from "../util/stats";

// 初始化配置和 GUI
const props = { backgroundColor: 0xffffff, fogColor: 0xffffff }
const gui = new GUI()

// 同步 mesh 状态到 props 的函数
function syncMeshToProps(mesh, props) {
    props.positionX = mesh.position.x;
    props.positionY = mesh.position.y;
    props.positionZ = mesh.position.z;
    props.rotationX = mesh.rotation.x;
    props.rotationY = mesh.rotation.y;
    props.rotationZ = mesh.rotation.z;
    props.scaleX = mesh.scale.x;
    props.scaleY = mesh.scale.y;
    props.scaleZ = mesh.scale.z;
}

// 这个函数为 3D 对象创建完整的控制界面
const addMeshProperties = (mesh) => {
    const props = {
        scaleX: mesh.scale.x,
        scaleY: mesh.scale.y,
        scaleZ: mesh.scale.z,
        rotationX: mesh.rotation.x,
        rotationY: mesh.rotation.y,
        rotationZ: mesh.rotation.z,
        positionX: mesh.position.x,
        positionY: mesh.position.y,
        positionZ: mesh.position.z,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        translate: () => {
            // 创建临时向量进行平移
            const direction = new THREE.Vector3(props.translateX, props.translateY, props.translateZ);
            mesh.position.add(direction);
            syncMeshToProps(mesh, props);
            updateGUI();
        },
        lookAtX: mesh.position.x,
        lookAtY: mesh.position.y + 1, // 默认看向上方
        lookAtZ: mesh.position.z + 1,
        lookAt: () => {
            mesh.lookAt(props.lookAtX, props.lookAtY, props.lookAtZ);
            syncMeshToProps(mesh, props);
            updateGUI();
        },
        visible: mesh.visible,
        castShadow: mesh.castShadow,
        rotateOnWorldAxisX: () => {
            mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI / 4);
            syncMeshToProps(mesh, props);
            updateGUI();
        },
        rotateOnWorldAxisY: () => {
            mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);
            syncMeshToProps(mesh, props);
            updateGUI();
        },
        rotateOnWorldAxisZ: () => {
            mesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), Math.PI / 4);
            syncMeshToProps(mesh, props);
            updateGUI();
        },
        reset: () => {
            mesh.scale.set(1, 1, 1);
            mesh.rotation.set(0, 0, 0);
            mesh.position.set(0, 1, 0); // 重置到地面上方
            props.translateX = 0;
            props.translateY = 0;
            props.translateZ = 0;
            props.lookAtX = 0;
            props.lookAtY = 1;
            props.lookAtZ = 1;
            syncMeshToProps(mesh, props);
            updateGUI();
        }
    };

    const meshFolder = gui.addFolder('Mesh');
    const controllers = {};

    // 缩放控制器
    controllers.scaleX = meshFolder.add(props, 'scaleX', 0, 5, 0.1);
    controllers.scaleY = meshFolder.add(props, 'scaleY', 0, 5, 0.1);
    controllers.scaleZ = meshFolder.add(props, 'scaleZ', 0, 5, 0.1);
    
    // 旋转控制器
    controllers.rotationX = meshFolder.add(props, 'rotationX', -Math.PI, Math.PI, 0.1);
    controllers.rotationY = meshFolder.add(props, 'rotationY', -Math.PI, Math.PI, 0.1);
    controllers.rotationZ = meshFolder.add(props, 'rotationZ', -Math.PI, Math.PI, 0.1);
    
    // 位置控制器（添加 listen() 以监听外部变化）
    controllers.positionX = meshFolder.add(props, 'positionX', -3, 3, 0.1).listen();
    controllers.positionY = meshFolder.add(props, 'positionY', -3, 3, 0.1).listen();
    controllers.positionZ = meshFolder.add(props, 'positionZ', -3, 3, 0.1).listen();
    
    // 平移控制器
    controllers.translateX = meshFolder.add(props, 'translateX', -5, 5, 0.1);
    controllers.translateY = meshFolder.add(props, 'translateY', -5, 5, 0.1);
    controllers.translateZ = meshFolder.add(props, 'translateZ', -5, 5, 0.1);
    controllers.translate = meshFolder.add(props, 'translate').name('执行平移');
    
    // 注视点控制器 - 扩大范围
    controllers.lookAtX = meshFolder.add(props, 'lookAtX', -10, 10, 0.1);
    controllers.lookAtY = meshFolder.add(props, 'lookAtY', -10, 10, 0.1);
    controllers.lookAtZ = meshFolder.add(props, 'lookAtZ', -10, 10, 0.1);
    controllers.lookAt = meshFolder.add(props, 'lookAt').name('执行注视');
    
    // 可见性和阴影
    controllers.visible = meshFolder.add(props, 'visible');
    controllers.castShadow = meshFolder.add(props, 'castShadow');
    
    // 世界坐标系旋转
    controllers.rotateOnWorldAxisX = meshFolder.add(props, 'rotateOnWorldAxisX');
    controllers.rotateOnWorldAxisY = meshFolder.add(props, 'rotateOnWorldAxisY');
    controllers.rotateOnWorldAxisZ = meshFolder.add(props, 'rotateOnWorldAxisZ');
    
    // 重置按钮
    controllers.reset = meshFolder.add(props, 'reset');

    // 更新 GUI 显示的函数
    function updateGUI() {
        Object.values(controllers).forEach(controller => {
            if (controller.updateDisplay) {
                controller.updateDisplay();
            }
        });
    }

    // 监听 GUI 变化
    meshFolder.onChange(() => {
        mesh.scale.set(props.scaleX, props.scaleY, props.scaleZ);
        mesh.rotation.set(props.rotationX, props.rotationY, props.rotationZ);
        mesh.position.set(props.positionX, props.positionY, props.positionZ);
        mesh.visible = props.visible;
        mesh.castShadow = props.castShadow;
    });

    // 返回控制器引用，便于外部访问
    return { controllers, props, updateGUI };
};

// 主场景初始化
initScene(props)(({ scene, camera, renderer, orbitControls }) => {
    // 相机和控制器设置
    camera.position.set(-7, 2, 5);
    orbitControls.update();
    
    // 创建地面
    floatingFloor(scene, 10);

    // 添加辅助坐标系
    // const axesHelper = new THREE.AxesHelper(3);
    // scene.add(axesHelper);

    // 创建 3D 立方体
    const geom = new THREE.BoxGeometry(1, 2, 3);
    const meshMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        roughness: 0.1
    });
    const mesh = new THREE.Mesh(geom, meshMat);
    mesh.castShadow = true;
    scene.add(mesh);

    // 添加网格辅助器
    const meshHelper = new THREE.BoxHelper(mesh, 0xffff00);
    scene.add(meshHelper);
    // scene.remove(meshHelper); //移除黄色辅助框

    // 更新辅助器的函数
    function updateHelpers() {
        meshHelper.update();
    }

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        stats.update();
        orbitControls.update();
        updateHelpers();
    }
    animate();

    // 初始化各种控制面板
    intializeRendererControls(gui, renderer);
    initializeHelperControls(gui, scene);
    initializeSceneControls(gui, scene);
    
    // 添加网格属性控制并获取控制器引用
    const meshControls = addMeshProperties(mesh);

    // 在网格属性变化时更新辅助器
    gui.onChange(() => {
        updateHelpers();
    });
});