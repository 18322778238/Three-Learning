import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../util/modelUtil'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/bakery/scene.gltf').then((structure) => {
    // position scene
    structure.scene.scale.setScalar(0.8, 0.8, 0.8)
    structure.scene.translateY(-1.8)
    structure.scene.translateX(-1.8)

    // make sure all cast shadows
    applyShadowsAndDepthWrite(structure.scene)
    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui) => {
    const controls = new ArcballControls(camera, renderer.domElement, scene)
    controls.update()

    const props = {
      activateGizmosTrue: () => controls.activateGizmos(true),
      activateGizmosfalse: () => controls.activateGizmos(false),
      setGizmosVisibleTrue: () => controls.setGizmosVisible(true),
      setGizmosVisibleFalse: () => controls.setGizmosVisible(false)
    }

    const folder = gui.addFolder('ArcBall 控件')
    folder.add(controls, 'adjustNearFar').name('调整近远')
    folder.add(controls, 'cursorZoom').name('光标缩放')
    folder.add(controls, 'enableAnimations').name('启用动画')
    folder.add(controls, 'enableGrid').name('启用网格')
    folder.add(controls, 'enablePan').name('启用平移')
    folder.add(controls, 'enableRotate').name('启用旋转')
    folder.add(controls, 'enableZoom').name('启用缩放')
    folder.add(controls, 'maxDistance', 0, 100, 1).name('最大距离')
    folder.add(controls, 'minDistance', 0, 10, 0.1).name('最小距离')
    folder.add(controls, 'scaleFactor', 0.1, 4, 0.01).name('缩放因子')
    folder.add(controls, 'focusAnimationTime', 0, 2000, 1).name('聚焦动画时间')
    folder.add(controls, 'dampingFactor', 0, 100, 1).name('阻尼系数')
    folder.add(controls, 'wMax', 0, 100, 1).name('最大角速度')
    folder.add(controls, 'dampingFactor', 0, 100, 1).name('阻尼系数')
    folder.add(controls, 'radiusFactor', 0, 1, 0.01).name('半径因子').onChange(() => controls.setTbRadius(controls.radiusFactor))
    folder.add(props, 'activateGizmosTrue').name('激活小工具(true)')
    folder.add(props, 'activateGizmosfalse').name('激活小工具(false)')
    folder.add(props, 'setGizmosVisibleTrue').name('设置控件可见(true)')
    folder.add(props, 'setGizmosVisibleFalse').name('设置控件可见(false)')
  }
}).then()