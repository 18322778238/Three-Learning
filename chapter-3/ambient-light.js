import * as THREE from 'three'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { initializeAmbientLightControls } from '../controls/lights-controls.js'
import { initScene } from '../bootstrap/bootstrap.js'
import { stats } from '../util/stats'

// 定义场景属性对象：背景色为浅灰色，禁用默认灯光
const props = {
  backgroundColor: 0xcccccc,
  disableLights: true
}
const gui = new GUI()

// 加载瀑布模型
const loadWaterfall = (scene) => {
  // 创建GLTF加载器实例
  const loader = new GLTFLoader()
  // 加载指定路径的GLTF模型文件
  loader.load('/assets/gltf/waterfall/scene.gltf', (loadedObject) => {
    // 从加载的对象中深度遍历获取实际的模型节点
    const loadedScene = loadedObject.scene.children[0].children[0].children[0]
    // 将模型绕X轴旋转-90度
    loadedScene.rotateX(-Math.PI / 2)
    console.log(loadedScene)
    scene.add(loadedScene)
  })
}

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-7, 2, 5)
  orbitControls.update()

  loadWaterfall(scene)

  function animate() {
    // 创建动画循环
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    stats.update()

    orbitControls.update()
  }

  const colorHolder = new THREE.Color(0xffffff)
  const light = new THREE.AmbientLight(colorHolder, 1)
  scene.add(light)
  // 初始化环境光的GUI控制面板
  initializeAmbientLightControls(gui, light)

  animate()
})