import GUI from "lil-gui";
import * as THREE from "three";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils";
import { initScene } from "../bootstrap/bootstrap.js";
import { floatingFloor } from "../bootstrap/floor.js";
import { initializeHelperControls } from "../controls/helpers-control.js";
import { intializeRendererControls } from "../controls/renderer-control.js";
import {
  initializeSceneControls
} from "../controls/scene-controls";
import { stats } from "../util/stats";

// 变量定义：场景属性配置对象，设置背景色和雾效颜色为白色
const props = { backgroundColor: 0xffffff, fogColor: 0xffffff };
// 创建 GUI 控制面板实例
const gui = new GUI();

// 顶点数据定义：定义了立方体的 8 个角点坐标，每个子数组代表一个顶点的 [x, y, z] 坐标，这些点构成了一个长方体的顶点
// prettier-ignore
const v = [
  [1, 3, 1],
  [1, 3, -1],
  [1, -1, 1],
  [1, -1, -1],
  [-1, 3, -1],
  [-1, 3, 1],
  [-1, -1, -1],
  [-1, -1, 1]]


//设置缓冲几何体为空 ，为稍后用于存储几何体数据
let bufferGeometry = undefined;

// 更新自定义几何函数
const updateCustomGeometry = (scene) => {
  // Buffergeometry 需要为面部的每一部分提供一个三元组数组
  // prettier-ignore
  const faces = new Float32Array([
    ...v[0], ...v[2], ...v[1],
    ...v[2], ...v[3], ...v[1],
    ...v[4], ...v[6], ...v[5],
    ...v[6], ...v[7], ...v[5],
    ...v[4], ...v[5], ...v[1],
    ...v[5], ...v[0], ...v[1],
    ...v[7], ...v[6], ...v[2],
    ...v[6], ...v[3], ...v[2],
    ...v[5], ...v[7], ...v[0],
    ...v[7], ...v[2], ...v[0],
    ...v[1], ...v[3], ...v[4],
    ...v[3], ...v[6], ...v[4]
  ]);
  // 创建 BufferGeometry：Three.js 的高性能几何体类型
  bufferGeometry = new THREE.BufferGeometry();
  // 将面数据设置为几何体的顶点位置属性
  bufferGeometry.setAttribute("position", new THREE.BufferAttribute(faces, 3));
  // 自动计算每个顶点的法线向量，用于光照计算和表面着色
  bufferGeometry.computeVertexNormals();

  // 调用 meshFromGeometry 函数将几何体转换为可渲染的网格
  const mesh = meshFromGeometry(bufferGeometry);
  mesh.name = "customGeometry";
  // remove the old one
  // 在场景中查找旧的几何体对象，如果存在，则将其从场景中移除
  const p = scene.getObjectByName("customGeometry");
  if (p) scene.remove(p);

  // 将新创建的集合体添加到场景
  scene.add(mesh);
  // 返回包含网格和几何体的对象
  return { mesh: mesh, geometry: bufferGeometry };
};

// 定义克隆几何体函数
const cloneGeometry = (scene) => {
  if (bufferGeometry) {
    // 创建原几何体的完整副本，包括所有属性和设置
    const clonedGeometry = bufferGeometry.clone();
    // 从克隆几何体的位置属性中获取底层的 Float32Array
    const backingArray = clonedGeometry.getAttribute("position").array;
    for (const i in backingArray) {
      // 检查是否为z坐标
      if ((i + 1) % 3 === 0) {
        // 将所有z坐标值增加3，使克隆体在z轴方向偏移
        backingArray[i] = backingArray[i] + 3;
      }
    }
    // 标记需要更新通知 Three.js 位置数据已更改，需要更新GPU缓冲区
    clonedGeometry.getAttribute("position").needsUpdate = true;
    // 创建克隆网格
    const cloned = meshFromGeometry(clonedGeometry);
    // 设置克隆体名称
    cloned.name = "clonedGeometry";
    // 移除旧克隆体
    const p = scene.getObjectByName("clonedGeometry");
    if (p) scene.remove(p);
    // 添加新克隆体
    scene.add(cloned);
  }
};

// 定义网格创建函数：接收几何体参数，返回具有多材质的网格对象
const meshFromGeometry = (geometry) => {
  // 创建线框材质
  var materials = [
    // 创建线框材质：不受光照影响的基础材质，红色（十六进制），显示为线框模式
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
    // 创建实体材质：朗伯材质，对光照有反应，10%不透明度，粉红色，启用透明度
    new THREE.MeshLambertMaterial({
      opacity: 0.1,
      color: 0xff0044,
      transparent: true,
    }),
  ];

  //创建多材质对象
  var mesh = createMultiMaterialObject(geometry, materials);
  // 设置对象名称
  mesh.name = "customGeometry";
  // 启用子对象阴影：遍历所有子网格（每个材质对应的网格），启用阴影投射
  mesh.children.forEach(function (e) {
    e.castShadow = true;
  });

  return mesh;
};

// 定义顶点控制函数：创建用于编辑顶点的GUI控件
const addVerticesControl = (scene) => {
  // 创建顶点文件夹
  const verticesFolder = gui.addFolder("vertices");
  // 添加克隆按钮
  verticesFolder.add({ clone: () => cloneGeometry(scene) }, "clone");

  for (const [i, vector] in v) {
    // 创建顶点属性对象
    const props = {
      x: v[i][0],
      y: v[i][1],
      z: v[i][2],
    };

    // 创建顶点子文件夹
    const subFolder = verticesFolder.addFolder("Vertex " + i);
    // 添加x坐标滑块
    subFolder.add(props, "x", -10, 10, 0.1).onChange((value) => {
      v[i][0] = value;
    });
    // 添加y坐标滑块
    subFolder.add(props, "y", -10, 10, 0.1).onChange((value) => {
      v[i][1] = value;
    });
    // 添加z坐标滑块
    subFolder.add(props, "z", -10, 10, 0.1).onChange((value) => {
      v[i][2] = value;
    });
  }
};

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  // 设置相机位置
  camera.position.set(-7, 2, 5);
  // 更新轨道控制器
  orbitControls.update();
  // 添加浮动地板
  floatingFloor(scene, 10);

  function animate() {
    // 更新几何体
    updateCustomGeometry(scene);
    // 请求下一帧
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
    orbitControls.update();
  }
  animate();

  intializeRendererControls(gui, renderer);
  initializeHelperControls(gui, scene);
  initializeSceneControls(gui, scene);

  addVerticesControl(scene);
});
