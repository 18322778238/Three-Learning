import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const props = {
  radius: 3,
  tube: 1,
  radialSegments: 8,
  tubularSegments: 8,
  arc: 2 * Math.PI
}

const updateGeometry = ({ radius, tube, radialSegments, tubularSegments, arc }) => {
  return new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc).translate(0, 2, 0)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('管道几何体')
    folder.add(props, 'radius', 0, 10, 0.01).name('半径').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'tube', 0, 10, 0.01).name('管道半径').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'radialSegments', 1, 20, 1).name('径向分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'tubularSegments', 1, 40, 1).name('管道分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'arc', 0, 2 * Math.PI, 0.01).name('管道弧度').onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()