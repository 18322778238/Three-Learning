import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { visitChildren } from '../util/modelUtil'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/canon_retro_camera/scene.gltf').then((structure) => {
    // position scene
    structure.scene.scale.setScalar(35, 35, 35)

    // make sure all cast shadows
    visitChildren(structure.scene, (child) => {
      if (child.material) {
        child.material.depthWrite = true
      }
    })

    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui) => {
    const controls = new OrbitControls(camera, renderer.domElement)

    const folder = gui.addFolder('轨道控制')
    folder.add(controls, 'autoRotate').name('自动旋转')
    folder.add(controls, 'autoRotateSpeed', 0, 30, 0.1).name('自动旋转速度')
    folder.add(controls, 'dampingFactor', 0, 0.2, 0.001).name('阻尼系数')
    folder.add(controls, 'enableDamping').name('启用阻尼')
    folder.add(controls, 'enablePan').name('启用平移')
    folder.add(controls, 'enableRotate').name('启用旋转')
    folder.add(controls, 'enableZoom').name('启用缩放')
    folder.add(controls, 'keyPanSpeed', 0, 20, 1).name('键盘平移速度')
    folder.add(controls, 'maxAzimuthAngle', -2 * Math.PI, 2 * Math.PI, 0.1).name('最大方位角')
    folder.add(controls, 'maxDistance', 0, 1000, 10).name('最大距离') 
    folder.add(controls, 'maxPolarAngle', 0, Math.PI, 0.1).name('最大极角')
    // folder.add(controls, 'maxZoom', 0, 20, 0.1) // only ortho
    folder.add(controls, 'minAzimuthAngle', Math.PI, 0.1).name('最小方位角')
    folder.add(controls, 'minDistance', 0, 10, 0.1).name('最小距离')
    folder.add(controls, 'minPolarAngle', 0, Math.PI, 0.1).name('最小极角')
    // folder.add(controls, 'minZoom', 0, 5, 0.1) // only ortho
    folder.add(controls, 'panSpeed', 0, 5, 0.1).name('平移速度')
    folder.add(controls, 'rotateSpeed', 0, 5, 0.1).name('旋转速度')
    folder.add(controls, 'screenSpacePanning').name('屏幕空间平移')
    folder.add(controls, 'zoomSpeed', 0, 5, 0.1).name('缩放速度')

    return controls
  },
  onRender: (clock, controls) => {
    controls.update(clock.getDelta())
  }
}).then()