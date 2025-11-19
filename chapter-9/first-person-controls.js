import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../util/modelUtil'
import { bootstrapMeshScene } from './util/standard-scene'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/medieval_fantasy_book/scene.gltf').then((structure) => {
    // 场景位置
    structure.scene.scale.setScalar(0.8, 0.8, 0.8)
    structure.scene.translateY(-1.8)
    structure.scene.translateX(-1.8)

    // 确保所有投影
    applyShadowsAndDepthWrite(structure.scene)
    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui) => {
    const controls = new FirstPersonControls(camera, renderer.domElement)
    const props = {}

    const folder = gui.addFolder('第一人称控制器')
    folder.add(controls, 'activeLook').name('激活观察')
    folder.add(controls, 'autoForward').name('自动前进')
    folder.add(controls, 'enabled').name('启用控制器')
    folder.add(controls, 'heightCoef', 0, 10, 0.1).name('高度系数')
    folder.add(controls, 'heightMax', 0, 10, 0.1).name('最大高度')
    folder.add(controls, 'heightMin', 0, 10, 0.1).name('最小高度')
    folder.add(controls, 'heightSpeed').name('高度速度')
    folder.add(controls, 'lookVertical').name('垂直观察')
    folder.add(controls, 'lookSpeed', 0, 0.2, 0.0001).name('观察速度')
    folder.add(controls, 'movementSpeed', 0, 10, 0.1).name('移动速度')
    folder.add(controls, 'verticalMax', 0, Math.PI, 0.1).name('最大垂直角度')
    folder.add(controls, 'verticalMin', 0, Math.PI, 0.1).name('最小垂直角度')
    return controls
  },
  onRender: (clock, controls) => {
    controls.update(clock.getDelta())
  }
}).then()