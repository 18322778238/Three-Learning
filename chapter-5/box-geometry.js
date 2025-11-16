// 交互式的3D立方体几何体演示工具
import * as THREE from 'three'
import { updateMesh } from './util'
import { bootstrapGeometryScene } from './util/standard-scene'

const props = {
  width: 3,
  height: 1,
  depth: 2,
  widthSegments: 10,
  heightSegments: 10,
  depthSegments: 10
}

const updateGeometry = ({ width, height, depth, widthSegments, heightSegments, depthSegments }) => {
  // 创建立方体几何体
  return new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('THREE.RingGeometry')
    folder.add(props, 'width', 0, 10, 0.01).name('宽度').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'height', 0, 10, 0.01).name('高度').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'depth', 0, 10, 0.01).name('深度').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'widthSegments', 1, 20, 1).name('宽度分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'heightSegments', 1, 20, 1).name('高度分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'depthSegments', 1, 20, 1).name('深度分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()