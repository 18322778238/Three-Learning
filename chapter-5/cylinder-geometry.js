// 交互式的圆柱体几何体演示工具
import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const props = {
  radiusTop: 1,
  radiusBottom: 1,
  height: 3,
  radialSegments: 30,
  heightSegments: 30,
  openEnded: true,
  thetaStart: 0,
  thetaLength: 2 * Math.PI
}

const updateGeometry = ({
  radiusTop,
  radiusBottom,
  height,
  radialSegments,
  heightSegments,
  openEnded,
  thetaStart,
  thetaLength
}) => {
  return new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength
  )
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('圆柱几何体')
    folder.add(props, 'radiusTop', -10, 10, 0.01).name('顶部半径').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'radiusBottom', -10, 10, 0.01).name('底部半径').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'height', 0, 10, 0.01).name('高度').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'radialSegments', 1, 100, 1).name('径向分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'heightSegments', 1, 100, 1).name('高度分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'openEnded').name('是否开启').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaStart', 0, Math.PI, 0.01).name('起始角度').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaLength', 0, 2 * Math.PI, 0.01).name('结束角度').onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()