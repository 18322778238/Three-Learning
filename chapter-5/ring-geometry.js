// 交互式的圆环几何体演示工具
import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const props = {
  innerRadius: 2,
  outerRadius: 3,
  thetaSegments: 20,
  phiSegments: 5,
  thetaStart: 0,
  thetaLength: Math.PI * 2
}

const updateGeometry = ({ innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength }) => {
  return new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('圆环几何体')
    folder.add(props, 'innerRadius', 0, 10, 0.01).name('内半径').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'outerRadius', 0, 10, 0.01).name('外半径').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaSegments', 0, 50, 1).name('径向分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'phiSegments', 0, 50, 1).name('高度分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaStart', 0, 2 * Math.PI, 0.01).name('起始角度').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaLength', 0, 2 * Math.PI, 0.01).name('结束角度').onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()