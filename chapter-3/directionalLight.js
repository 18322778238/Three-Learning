import GUI from 'lil-gui'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { initScene } from '../bootstrap/bootstrap.js'
import { intializeRendererControls } from '../controls/renderer-control.js'
import { visitChildren } from '../util/modelUtil.js'
import { stats } from '../util/stats'

const props = {
  backgroundColor: 0xcccccc,
  disableLights: true
}
const gui = new GUI()

// Determine what to do with this one.
// const loadWaterfall = (scene) => {
//   const loader = new GLTFLoader();
//   loader.load("/assets/gltf/flying_island/scene.gltf", (loadedObject) => {
//     // the nested
//     const loadedScene = loadedObject.scene.children[0].children[0].children[0];
//     visitChildren(loadedScene, (c) => {
//       c.receiveShadow = true;
//       c.castShadow = true;
//     });
//     loadedScene.scale.set(0.03, 0.03, 0.03);
//     loadedScene.translateY(-7);
//     scene.add(loadedScene);
//   });
// };

// 瀑布模型加载
const loadWaterfall = (scene) => {
  const loader = new GLTFLoader()
  loader.load('/assets/gltf/waterfall/scene.gltf', (loadedObject) => {
    // the nested
    // 深度访问模型结构，获取实际的模型节点
    const loadedScene = loadedObject.scene.children[0].children[0].children[0]
    // 递归遍历所有子对象，为每个几何体启用阴影接收和投射
    visitChildren(loadedScene, (c) => {
      c.receiveShadow = true
      c.castShadow = true
    })
    // 绕 X 轴旋转 -90 度来正确摆放模型
    loadedScene.rotateX(-0.5 * Math.PI)
    scene.add(loadedScene)
  })
}

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  // 设置阴影映射类型为 PCF 软阴影，提供更柔和的阴影边缘
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  camera.position.set(-4, 14, 4)
  orbitControls.update()

  loadWaterfall(scene)

  // 创建方向光，模拟太阳光
  const directionalLight = new THREE.DirectionalLight()
  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
  const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
  scene.add(directionalLightHelper)
  scene.add(shadowCameraHelper)

  directionalLightHelper.visible = true
  shadowCameraHelper.visible = true

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    stats.update()
    directionalLightHelper.update()
    orbitControls.update()
    shadowCameraHelper.update()
    directionalLight.shadow.camera.updateProjectionMatrix()
  }

  const colorHolder = new THREE.Color(0xffffff)
  const light = new THREE.AmbientLight(0x444444)
  scene.add(light)
  scene.add(directionalLight.target)

  // 方向光设置
  directionalLight.penumbra = 0.4
  directionalLight.position.set(10, 14, 5)
  directionalLight.distance = 0
  directionalLight.castShadow = true
  directionalLight.intensity = 1
  directionalLight.shadow.camera.near = 1
  directionalLight.shadow.camera.far = 25
  directionalLight.shadow.camera.right = 10
  directionalLight.shadow.camera.left = -10
  directionalLight.shadow.camera.top = 10
  directionalLight.shadow.camera.bottom = -10
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.bias = -0.01

  const props = {
    color: colorHolder.getStyle()
  }

  const spotLightFolder = gui.addFolder('Spotlight')
  spotLightFolder.addColor(props, 'color').onChange((c) => directionalLight.color.setStyle(c))
  spotLightFolder.add(directionalLight, 'intensity', 0, 5, 0.1)
  spotLightFolder.add(directionalLight.position, 'x', -30, 30, 0.1).name('positionX')
  spotLightFolder.add(directionalLight.position, 'y', -30, 30, 0.1).name('positionY')
  spotLightFolder.add(directionalLight.position, 'z', -30, 30, 0.1).name('positionZ')
  spotLightFolder.add(directionalLight.target.position, 'x', -30, 30, 0.1).name('targetX')
  spotLightFolder.add(directionalLight.target.position, 'y', -30, 30, 0.1).name('targetY')
  spotLightFolder.add(directionalLight.target.position, 'z', -30, 30, 0.1).name('targetZ')

  spotLightFolder.add(directionalLight, 'castShadow')
  spotLightFolder.add(directionalLightHelper, 'visible').name('directional-light-helper')

  const shadowCameraFolder = gui.addFolder('ShadowCamera')
  shadowCameraFolder.add(shadowCameraHelper, 'visible').name('shadow-helper')
  shadowCameraFolder.add(directionalLight.shadow.camera, 'zoom', 0, 5, 0.1)
  shadowCameraFolder.add(directionalLight.shadow.camera, 'near', 0.1, 50, 0.1)
  shadowCameraFolder.add(directionalLight.shadow.camera, 'far', 1, 100, 0.1)
  shadowCameraFolder.add(directionalLight.shadow.camera, 'right', -50, 50, 0.1)
  shadowCameraFolder.add(directionalLight.shadow.camera, 'left', -50, 50, 0.1)
  shadowCameraFolder.add(directionalLight.shadow.camera, 'top', -50, 50, 0.1)
  shadowCameraFolder.add(directionalLight.shadow.camera, 'bottom', -50, 50, 0.1)

  // directionalLight.shadow.camera.near = 1;
  // directionalLight.shadow.camera.far = 25;
  // directionalLight.shadow.camera.right = 10;
  // directionalLight.shadow.camera.left = -10;
  // directionalLight.shadow.camera.top = 10;
  // directionalLight.shadow.camera.bottom = -10;
  // directionalLight.shadow.mapSize.width = 2048;
  // directionalLight.shadow.mapSize.height = 2048;

  scene.add(directionalLight)

  intializeRendererControls(gui, renderer)

  animate()
})