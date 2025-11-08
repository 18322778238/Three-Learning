// 辅助工具模块
import * as THREE from 'three'

// 常量定义部分
export const axisHelperName = 'axesHelper'
export const gridHelperName = 'gridHelper'
export const polarGridHelperName = 'polarGridHelper'

// 坐标轴辅助函数：创建一个长度为5的三维坐标轴辅助对象，X轴（红色）、Y轴（绿色）、Z轴（蓝色）用于直观显示场景的世界坐标系方向
export const axisHelper = (scene) => {
  const axesHelper = new THREE.AxesHelper(5)
  axesHelper.name = axisHelperName
  scene.add(axesHelper)
}
// 网格辅助函数：创建一个10×10单位的平面网格，分为10×10个小格子，用于提供地面参考和空间尺度感
export const gridHelper = (scene) => {
  const size = 10
  const divisions = 10
  const gridHelper = new THREE.GridHelper(size, divisions)
  gridHelper.name = gridHelperName
  scene.add(gridHelper)
}
// 极坐标网格辅助函数：创建一个半径为10的极坐标网格，包含16条径向线（从中心向外辐射），8个同心圆环，64个分段（决定圆的平滑度）适用于圆形或旋转对称的场景参考
export const polarGridHelper = (scene) => {
  const radius = 10
  const radials = 16
  const circles = 8
  const divisions = 64
  const polarGridHelper = new THREE.PolarGridHelper(radius, radials, circles, divisions)
  polarGridHelper.name = polarGridHelperName
  scene.add(polarGridHelper)
}