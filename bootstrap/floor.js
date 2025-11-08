import * as THREE from 'three'

// 创建一个无限大的平面作为地板
export const foreverPlane = (scene) => {
  // 创建巨大的平面几何体
  const geo = new THREE.PlaneGeometry(10000, 10000)
  // 创建Lambert材质（无光泽表面）
  const mat = new THREE.MeshLambertMaterial({
    color: 0xffffff // 白色
  })
  // 创建网格对象
  const mesh = new THREE.Mesh(geo, mat)
  // 设置位置（向下移动2个单位）
  mesh.position.set(0, -2, 0)
  // 旋转平面使其水平（绕X轴旋转-90度）
  mesh.rotation.set(Math.PI / -2, 0, 0)
  // 启用接收阴影
  mesh.receiveShadow = true
  // 设置名称便于识别
  mesh.name = 'forever-floor'
  // 添加到场景
  scene.add(mesh)

  return mesh
}

// 创建一个浮动的方块地板
export const floatingFloor = (scene, size) => {
  // 设置尺寸，默认为6
  const s = size ? size : 6
  // 创建立方体几何体作为地板，细分10份
  const geo = new THREE.PlaneGeometry(s, 0.25, s, 10, 10, 10)
  // 创建Standard材质（PBR材质）
  const mat = new THREE.MeshStandardMaterial({
    color: 0xdddddd // 浅灰色
  })
  // 创建网格对象
  const mesh = new THREE.Mesh(geo, mat)
  // 设置位置（向下移动2个单位，向后移动1个单位）
  mesh.position.set(0, -2, -1)
  // 启用接收阴影
  mesh.receiveShadow = true
  // 设置名称
  mesh.name = 'floating-floor'
  // 添加到场景
  scene.add(mesh)

  return mesh
}