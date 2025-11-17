// 盒状线几何体3D场景

import * as THREE from 'three'
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry'
import { updateMesh } from './util'
import { bootstrapGeometryScene } from './util/standard-scene'

const props = {
    width: 6,
    height: 6,
    depth: 6,
    widthSegments: 10,
    heightSegments: 10,
    depthSegments: 10
}

const updateGeometry = ({ width, height, depth, widthSegments, heightSegments, depthSegments }) => {
    return new BoxLineGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
    geometry,
    provideGui: (gui, mesh) => {
        const folder = gui.addFolder('箱线几何体')
        folder.add(props, 'width', 0, 10, 0.01).name('宽度').onChange(() => updateMesh(mesh, updateGeometry(props)))
        folder.add(props, 'height', 0, 10, 0.01).name('高度').onChange(() => updateMesh(mesh, updateGeometry(props)))
        folder.add(props, 'depth', 0, 10, 0.01).name('深度').onChange(() => updateMesh(mesh, updateGeometry(props)))
        folder.add(props, 'widthSegments', 1, 20, 1).name('宽度分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
        folder.add(props, 'heightSegments', 1, 20, 1).name('高度分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
        folder.add(props, 'depthSegments', 1, 20, 1).name('深度分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    },
    overrideMaterial: new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 1  
    }),
    useLine: true
}).then()