// chapter-8/load-ifc.js
import { bootstrapMeshScene } from './util/standard-scene.js'
import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader.js' // ← 加 .js！
import { visitChildren } from '../util/modelUtil.js'

const modelAsync = () => {
  const loader = new IFCLoader()
  loader.ifcManager.setWasmPath('/assets/models/ifc/') // 建议用绝对路径 /

  return loader.loadAsync('/assets/models/ifc/schependomlaan.ifc').then((model) => {
    model.scale.set(0.5, 0.5, 0.5)
    model.translateX(-5)
    model.translateY(-1.4)
    visitChildren(model, (child) => {
      child.receiveShadow = true
      child.castShadow = true
    })
    return model
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  floorSize: 200
}).then()