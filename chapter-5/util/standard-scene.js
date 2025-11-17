// 几何体展示场景的初始化框架
import { initScene } from '../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../controls/renderer-control'

import GUI from 'lil-gui'
import * as THREE from 'three'
import { foreverPlane } from '../../bootstrap/floor'
import { initializeGuiMaterial, initializeGuiMeshStandardMaterial } from '../../controls/material-controls'
import { initializeMeshVisibleControls } from '../../controls/mesh-visible-controls'
import { initializeSceneControls } from '../../controls/scene-controls'

export const bootstrapGeometryScene = async ({ geometry, provideGui, hidefloor }) => {
  const props = {
    backgroundColor: 0xffffff,
    fogColor: 0xffffff
  }

  const gui = new GUI({ title: '控制器' })

  const init = async () => {
    const material = new THREE.MeshStandardMaterial({
      color: 0xffaa88
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    initScene(props)(({ scene, camera, renderer, orbitControls }) => {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      camera.position.x = -3
      camera.position.z = 8
      camera.position.y = 2
      orbitControls.update()

      function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        orbitControls.update()
      }

      animate()

      const plane = hidefloor ?? foreverPlane(scene)
      scene.add(mesh)
      intializeRendererControls(gui, renderer)
      initializeSceneControls(gui, scene, false)

      initializeGuiMaterial(gui, mesh, material).close()
      initializeGuiMeshStandardMaterial(gui, mesh, material).close()
      hidefloor ?? initializeMeshVisibleControls(gui, plane, '地板')
      provideGui(gui, mesh)
    })
  }

  init().then()
}