import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../util/modelUtil'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/new_york_city_manhattan/scene.gltf').then((structure) => {
    // position scene
    structure.scene.scale.setScalar(5, 5, 5)

    // make sure all cast shadows
    applyShadowsAndDepthWrite(structure.scene)
    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui) => {
    const controls = new FlyControls(camera, renderer.domElement)

    const folder = gui.addFolder('第一人称控制器')
    folder.add(controls, 'dragToLook').name('拖动观察')
    folder.add(controls, 'autoForward').name('自动前进')
    folder.add(controls, 'movementSpeed', 0, 10, 0.1).name('移动速度')
    folder.add(controls, 'rollSpeed', 0, 1, 0.1).name('滚动速度')
    return controls
  },
  onRender: (clock, controls) => {
    controls.update(clock.getDelta())
  }
}).then()