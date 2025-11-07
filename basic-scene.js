import GUI from 'lil-gui'
// 引入浮空平面
import { floatingFloor } from './bootstrap/floor'
// 引入初始化添加删除立方体控件
import { initializeAddRemoveCubeControls } from './controls/add-remove-cube-controls'
// 引入初始化辅助控件
import { initializeHelperControls } from './controls/helpers-control'
// 引入初始化场景控制
import { initializeSceneControls } from './controls/scene-controls'
// 引入初始化场景
import { initScene } from './bootstrap/bootstrap'
// 引入初始化渲染器控件
import { intializeRendererControls } from './controls/renderer-control'
// 引入three.js中的stats模块
import { stats } from './util/stats'

const props = {
    backgroundColor: 0xffffff,
    fogColor: 0xffffff
}
const gui = new GUI()

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
    // 设置相机初始位置：X轴-7，Y轴2，Z轴5
    camera.position.set(-7, 2, 5)
    // 立即更新轨道控制器，应用相机位置变化
    orbitControls.update()

    // 在场景中添加浮空平面，大小为10个单位
    floatingFloor(scene, 10)

    // 动画循环
    function animate() {
        // 创建平滑的动画循环
        requestAnimationFrame(animate)
        // 渲染器将场景和相机结合，绘制到画布上
        renderer.render(scene, camera)
        // 更新性能统计显示（FPS、帧时间等）
        stats.update()

        // 更新轨道控制器状态，处理用户交互（鼠标拖拽、缩放等）
        orbitControls.update()
    }
    animate()

    // 初始化渲染器控制面板
    intializeRendererControls(gui, renderer)
    // 初始化辅助对象控制面板
    initializeHelperControls(gui, scene)
    // 初始化场景控制面板
    initializeSceneControls(gui, scene, true)
    // 初始化立方体添加/删除控制面板
    initializeAddRemoveCubeControls(gui, scene)
})