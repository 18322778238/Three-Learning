import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


export const initOrbitControls = (camera, renderer) => {
    // OrbitControls 实例化
    const controller = new OrbitControls(camera, renderer.domElement)
    // 启用阻尼效果
    controller.enableDamping = true
    // 设置阻尼系数
    controller.dampingFactor = 0.05
    // 设置最小和最大距离
    controller.minDistance = 1
    controller.maxDistance = 100
    // 设置垂直角度限制
    controller.minPolarAngle = Math.PI / 4
    controller.maxPolarAngle = (3 * Math.PI) / 4

    return controller
}