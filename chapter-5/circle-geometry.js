// 交互式的2D圆形几何体演示工具
import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const circleProps = {
  radius: 2,
  segments: 32,
  thetaStart: 0,
  thetaLength: 2 * Math.PI
}

const updateGeometry = ({ radius, segments, thetaStart, thetaLength }) => {
  return new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength)
}

const geometry = updateGeometry(circleProps)

const props = {
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('二维圆形几何')
    folder.add(circleProps, 'radius', 0, 10, 0.01).name('半径').onChange(() => updateMesh(mesh, updateGeometry(circleProps)))
    folder.add(circleProps, 'segments', 0, 50, 1).name('分割').onChange(() => updateMesh(mesh, updateGeometry(circleProps)))
    folder.add(circleProps, 'thetaStart', 0, 10, 0.01).name('起始角度').onChange(() => updateMesh(mesh, updateGeometry(circleProps)))
    folder.add(circleProps, 'thetaLength', 0, 10, 0.01).name('结束角度').onChange(() => updateMesh(mesh, updateGeometry(circleProps)))
  }
}

bootstrapGeometryScene(props).then()