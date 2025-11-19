import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../util/modelUtil'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/the_mill/scene.gltf').then((structure) => {
    // position scene
    applyShadowsAndDepthWrite(structure.scene)
    structure.scene.translateY(1)
    structure.scene.translateX(-3)
    structure.scene.scale.setScalar(1.6)
    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui) => {
    const controls = new PointerLockControls(camera, renderer.domElement)

    const folder = gui.addFolder('指针锁定控制')
    folder.add(controls, 'maxPolarAngle', 0, Math.PI, 0.1).name('最大极角')
    folder.add(controls, 'minPolarAngle', 0, Math.PI, 0.1).name('最小极角')
    folder.add(controls, 'pointerSpeed', 0, 5, 0.1).name('指针速度')

    document.addEventListener('click', () => {
      controls.lock()
    })

    controls.addEventListener('lock', (event) => {
      console.log('Locking the controls', event)
    })

    controls.addEventListener('unlock', (event) => {
      console.log('Unlocking the controls', event)
    })

    controls.addEventListener('change', (event) => {
      console.log('Mouse change detected', event)
    })

    return controls
  }
}).then()