import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshBasicMaterial } from '../controls/material-controls'

// 定义配置对象
const props = {
  //创建一个灰色的基础材质（RGB: 0x777777 ≈ #777777）
  material: new THREE.MeshBasicMaterial({ color: 0x777777 }), 
  withMaterialGui: true,
  provideGui: (gui, mesh, material) => {
    initializeGuiMeshBasicMaterial(gui, mesh, material)
  }
}

bootstrapMaterialScene(props).then()