import * as THREE from 'three'
import { initOrbitControls } from '../controller/orbit-controller'
import { onResize } from '../util/update-on-resize'
import { initLighting } from './lighting'

// 导出一个初始化场景的函数，接受配置参数
export const initScene = ({ backgroundColor, fogColor, disableShadows, disableLights, disableDefaultControls }) => {
  // 返回一个初始化函数，接受回调函数fn
  const init = (fn) => {
    // 创建Three.js场景
    const scene = new THREE.Scene()
    // 如果提供了背景色，设置场景背景色
    if (backgroundColor) {
      scene.background = backgroundColor
    }
    // 如果提供了雾效颜色，创建雾效
    if (fogColor) {
      scene.fog = new THREE.Fog(fogColor, 0.0025, 50)
    }

    // 创建透视相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    // 创建WebGL渲染器，开启抗锯齿
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    // 设置输出编码为sRGB
    renderer.outputColorSpace = THREE.sRGBEncoding
    // 启用阴影映射
    renderer.shadowMap.enabled = true
    // 设置阴影类型为VSM阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // renderer.shadowMap.type = THREE.VSMShadowMap
    // 设置清除颜色
    renderer.setClearColor(backgroundColor)

    // 设置窗口大小变化监听
    onResize(camera, renderer)
    // 设置渲染器尺寸为窗口尺寸
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 将渲染器的canvas元素添加到body中
    document.body.appendChild(renderer.domElement)

    // 初始化轨道控制器    
    let orbitControls
    if (!disableDefaultControls) {
      orbitControls = initOrbitControls(camera, renderer)
    }

    // 添加基础光照到场景
    if (!disableLights ?? false) {
      initLighting(scene, { disableShadows })
    }

    // 调用回调函数，传递创建的场景对象
    fn({ scene, camera, renderer, orbitControls })
  }

  return init
}