import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const props = {
  radius: 2,
  tube: 0.5,
  radialSegments: 100,
  tubularSegments: 30,
  p: 2,
  q: 3
}

const updateGeometry = ({ radius, tube, radialSegments, tubularSegments, p, q }) => {
  return new THREE.TorusKnotGeometry(radius, tube, radialSegments, tubularSegments, p, q).translate(0, 2, 0)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('圆环结几何体')
    folder.add(props, 'radius', 0, 3, 0.01).name('半径').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'tube', 0, 3, 0.01).name('管道半径').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'radialSegments', 1, 200, 1).name('径向分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'tubularSegments', 1, 40, 1).name('管道分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'p', 1, 10, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'q', 1, 10, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()