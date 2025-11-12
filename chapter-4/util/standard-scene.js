// 材质场景的引导程序，用于创建和管理包含不同3D模型和材质的场景
import { initScene } from '../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../controls/renderer-control'

import GUI from 'lil-gui'
import { initializeGuiMaterial } from '../../controls/material-controls'
import { initializeSceneControls } from '../../controls/scene-controls'
import { sampleFox, sampleKnot, sampleSphere, sampleMaterialBall, sampleVertexColors } from '../../models/models'
import { initializeModelSelectControls } from '../../controls/model-select-control'
import { sampleGosper } from '../../models/models'
import * as THREE from 'three'

// 导出一个异步函数，接收配置参数
export const bootstrapMaterialScene = async ({ material, withMaterialGui, provideGui }) => {
  // 初始化配置:背景色为白色
  const props = {
    backgroundColor: 0xffffff
  }
  const gui = new GUI()

  // 初始化函数
  const init = async () => {
    // 加载模型
    const floatingSphereMesh = sampleSphere(material)
    const foxMesh = await sampleFox(material)
    const materialBallMesh = await sampleMaterialBall(material)
    const sampleVertexColorsMesh = await sampleVertexColors(material)
    const knotMesh = sampleKnot(material)
    const gosperMesh = sampleGosper(material)

    initScene(props)(({ scene, camera, renderer, orbitControls }) => {
      // 设置渲染器阴影贴图类型为PCF软阴影
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      // 设置相机初始位置
      camera.position.x = -3
      camera.position.z = 8
      camera.position.y = 2
      // 更新轨道控制器
      orbitControls.update()

      function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        orbitControls.update()
      }

      animate()

      scene.add(floatingSphereMesh)

      intializeRendererControls(gui, renderer)
      initializeSceneControls(gui, scene, false)
      initializeModelSelectControls(
        gui,
        {
          sphere: floatingSphereMesh,
          fox: foxMesh,
          knot: knotMesh,
          materialBall: materialBallMesh,
          vertexColors: sampleVertexColorsMesh,
          gosperMesh: gosperMesh
        },
        (selected) => {
          scene.remove(floatingSphereMesh)
          scene.remove(foxMesh)
          scene.remove(knotMesh)
          scene.remove(materialBallMesh)
          scene.remove(sampleVertexColorsMesh)
          scene.remove(gosperMesh)
          scene.add(selected)

          if (withMaterialGui) initializeGuiMaterial(gui, selected, material)
          provideGui(gui, selected, material, scene)
        }
      )
      if (withMaterialGui) initializeGuiMaterial(gui, floatingSphereMesh, material)
      provideGui(gui, floatingSphereMesh, material, scene)
    })
  }

  init().then()
}