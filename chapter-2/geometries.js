import GUI from "lil-gui";
import * as THREE from "three";
import { ConvexGeometry } from "three/addons/geometries/ConvexGeometry.js";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils";
import { initScene } from "../bootstrap/bootstrap.js";
import { floatingFloor } from "../bootstrap/floor.js";
import { initializeHelperControls } from "../controls/helpers-control.js";
import { intializeRendererControls } from "../controls/renderer-control.js";
import { initializeSceneControls } from "../controls/scene-controls.js";
import { randomColor } from "../util/colorUtil.js";
import { stats } from "../util/stats.js";

const props = { backgroundColor: 0xffffff, disableShadows: true };
const gui = new GUI();

const addGeometries = (scene) => {
    const geoms = [];

    geoms.push(new THREE.CylinderGeometry(1, 4, 4));                // 圆锥体(上半径1,下半径4,高4)
    geoms.push(new THREE.BoxGeometry(2, 2, 2));                     // 立方体(长宽高各2)
    geoms.push(new THREE.SphereGeometry(2));                        // 球体(半径2)
    geoms.push(new THREE.IcosahedronGeometry(4));                   // 二十面体(半径4)

    // 凸包几何体 8个顶点
    const points = [
        new THREE.Vector3(2, 2, 2),
        new THREE.Vector3(2, 2, -2),
        new THREE.Vector3(-2, 2, -2),
        new THREE.Vector3(-2, 2, 2),
        new THREE.Vector3(2, -2, 2),
        new THREE.Vector3(2, -2, -2),
        new THREE.Vector3(-2, -2, -2),
        new THREE.Vector3(-2, -2, 2),
    ];
    geoms.push(new ConvexGeometry(points));

    // 旋转体几何体
    const pts = [];
    const detail = 0.1;
    const radius = 3;
    for (
        var angle = 0.0;
        angle < Math.PI;
        angle += detail //loop from 0.0 radians to PI (0 - 180 degrees)
    )
        pts.push(
            new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
        ); //angle/radius to x,z
    geoms.push(new THREE.LatheGeometry(pts, 12));       // 车床几何体(旋转体)
    geoms.push(new THREE.OctahedronGeometry(3));         // 八面体
    // geoms.push(new ParametricGeometry(ParametricGeometries.mobius3d, 20, 10));      // 莫比乌斯带
    geoms.push(new THREE.TetrahedronGeometry(3));              // 四面体
    geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));          // 圆环体
    geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));    // 环面纽结

    var j = 0;
    for (var i = 0; i < geoms.length; i++) {
        // 创建双材质：实体颜色 + 线框
        var materials = [
            new THREE.MeshLambertMaterial({
                color: randomColor(),       // 实体材质
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true,        // 线框材质
            }),
        ];
        // 创建多材质对象
        var mesh = createMultiMaterialObject(geoms[i], materials);
        mesh.traverse(function (e) {
            e.castShadow = true;        // 启用阴影投射
        });

        // 网格布局：4列网格
        mesh.position.x = -24 + (i % 4) * 12;       // X位置：每行4个
        mesh.position.y = 4;                        // Y位置：高度4
        mesh.position.z = -8 + j * 12;              // Z位置：每4个换行

        if ((i + 1) % 4 == 0) j++;      // 每4个几何体换行
        scene.add(mesh);        // 添加到场景
    }
};

// 场景初始化
initScene(props)(({ scene, camera, renderer, orbitControls }) => {
    // 设置相机位置
    camera.position.set(-35, 10, 25);
    // 更新轨道控制器
    orbitControls.update();
    // 添加地板
    floatingFloor(scene, 60);

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);     // 请求下一帧动画
        renderer.render(scene, camera);     // 渲染场景
        stats.update();                     // 更新性能统计
        orbitControls.update();             // 更新轨道控制
    }
    animate();          // 启动动画循环

    intializeRendererControls(gui, renderer);           // 渲染器控制
    initializeHelperControls(gui, scene);               // 辅助工具控制
    initializeSceneControls(gui, scene);                // 场景控制

    addGeometries(scene);               // 添加所有几何体到场景
});