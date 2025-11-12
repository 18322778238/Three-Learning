import * as THREE from 'three'
import { initializeMeshNormalMaterial } from '../controls/material-controls'
import { bootstrapMaterialScene } from './util/standard-scene'

const props = {
    material: new THREE.MeshNormalMaterial(),
    withMaterialGui: true,
    provideGui: (gui, mesh, material, scene) => {
        initializeMeshNormalMaterial(gui, mesh, material, scene)
    }
}

bootstrapMaterialScene(props).then()