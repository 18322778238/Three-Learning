import * as THREE from 'three'

// 初始化场景光照
export const initLighting = (scene, { disableShadows }) => {
  // https://threejs.org/examples/?q=shado#webgl_shadowmap_vsm
  // 注释，指向Three.js官方阴影映射示例的链接，参考VSM（Variance Shadow Map）阴影技术
  
  // 创建并添加环境光
  scene.add(new THREE.AmbientLight(0x666666))

  // const dirLight = new THREE.DirectionalLight(0xaaaaaa)
  // 创建方向光
  const dirLight = new THREE.DirectionalLight(0xaaaaaa)
  // 设置方向光的位置
  dirLight.position.set(5, 12, 8)
  // 控制是否投射阴影
  dirLight.castShadow = !disableShadows ? true : false
  // 设置光照强度
  dirLight.intensity = 1
  // 设置阴影相机的近裁剪面和远裁剪面
  dirLight.shadow.camera.near = 0.1
  dirLight.shadow.camera.far = 200
  // 设置阴影相机的正交投影范围
  dirLight.shadow.camera.right = 10
  dirLight.shadow.camera.left = -10
  dirLight.shadow.camera.top = 10
  dirLight.shadow.camera.bottom = -10
  // 设置阴影贴图的分辨率
  dirLight.shadow.mapSize.width = 2048
  dirLight.shadow.mapSize.height = 2048
  
  // 设置阴影偏移量
  dirLight.shadow.bias = -0.00005

  scene.add(dirLight)
}