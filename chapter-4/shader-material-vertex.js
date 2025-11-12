import * as THREE from 'three'
import { initScene } from '../bootstrap/bootstrap'
import { intializeRendererControls } from '../controls/renderer-control'

import GUI from 'lil-gui'

import fs_simple from './glsl/fs-simple-basic.glsl?raw'
import vs_simple from './glsl/vs-simple-basic.glsl?raw'
import fs_night_sky from './glsl/fs-night-sky-basic.glsl?raw'
import vs_noop from './glsl/vs-noop.glsl?raw'
import fs_color_shift from './glsl/fs-color-shift-basic.glsl?raw'
import vs_ripple from './glsl/vs-simple-ripple-basic.glsl?raw'

import { getObjectsKeys } from '../util'

const props = {
  backgroundColor: 0xffffff,
  fogColor: 0xffffff
}
const gui = new GUI()

const getVertexShaderPlane = () => {
  const geometry = new THREE.PlaneGeometry(10, 10, 100, 100)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() } // TODO: we should add a value here
    },
    vertexShader: vs_simple,
    fragmentShader: fs_simple
  })

  return { geometry, material }
}

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-3, 8, 2)
  camera.near = 4
  camera.far = 20

  camera.updateProjectionMatrix()
  orbitControls.update()

  const props = {
    vertexShader: '简单顶点着色器',
    fragmentShader: '简单片段着色器',
    timeIncrement: 0.005
  }

  const { geometry, material } = getVertexShaderPlane()

  const shaderFolder = gui.addFolder('着色器设置')
  
  // 着色器中文化映射
  const vertexShaders = { 
    '简单顶点着色器': vs_simple, 
    '无操作顶点着色器': vs_noop, 
    '波纹顶点着色器': vs_ripple 
  }
  const fragmentShaders = { 
    '简单片段着色器': fs_simple, 
    '夜空片段着色器': fs_night_sky, 
    '颜色变换片段着色器': fs_color_shift 
  }

  shaderFolder.add(props, 'fragmentShader', getObjectsKeys(fragmentShaders))
    .name('片段着色器')
    .onChange((changed) => {
      material.fragmentShader = fragmentShaders[changed]
      material.needsUpdate = true
    })
    
  shaderFolder.add(props, 'vertexShader', getObjectsKeys(vertexShaders))
    .name('顶点着色器')
    .onChange((changed) => {
      material.vertexShader = vertexShaders[changed]
      material.needsUpdate = true
    })
    
  shaderFolder.add(props, 'timeIncrement', -0.01, 0.01, 0.001)
    .name('时间增量')

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    orbitControls.update()
    material.uniforms.time.value += props.timeIncrement
  }
  animate()

  intializeRendererControls(gui, renderer)
})