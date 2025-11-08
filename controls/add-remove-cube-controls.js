// 添加-移除-立方体控件.js
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils'
import * as THREE from 'three'
// 引入随机颜色
import { randomColor } from '../util/colorUtil.js'
// 引入随机向量
import { randomVector } from '../util/positionUtil.js'

export const initializeAddRemoveCubeControls = (gui, parent, material) => {
    const addRemoveProps = {
        addCube: () => addCube(parent, material),
        removeCube: () => removeCube(parent)
    }
    //在GUI界面中添加两个按钮控件
    gui.add(addRemoveProps, 'addCube')
    gui.add(addRemoveProps, 'removeCube')
}

const addCube = (parent, material) => {
    //生成随机颜色
    const color = randomColor()
    //在指定范围内生成随机位置向量
    const pos = randomVector({
        xRange: { fromX: -4, toX: 4 },
        yRange: { fromY: -3, toY: 3 },
        zRange: { fromZ: -4, toZ: 4 }
    })
    //生成随机旋转角度（0到2π弧度）
    const rotation = randomVector({
        xRange: { fromX: 0, toX: Math.PI * 2 },
        yRange: { fromY: 0, toY: Math.PI * 2 },
        zRange: { fromZ: 0, toZ: Math.PI * 2 }
    })
    //创建立方体几何体，尺寸为0.5×0.5×0.5
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    //如果提供了材质参数则使用之，否则创建新的金属质感材质
    const cubeMaterial =
        material ??
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.1,
            metalness: 0.9
        })

    // 根据材质类型创建网格对象：如果是材质数组，创建多材质对象则创建普通网格
    let cube
    if (Array.isArray(cubeMaterial)) {
        cube = SceneUtils.createMultiMaterialObject(geometry, cubeMaterial)
    } else {
        cube = new THREE.Mesh(geometry, cubeMaterial)
    }
    //为立方体设置唯一名称
    cube.name = 'cube-' + parent.children.length
    //设置位置和旋转
    cube.position.copy(pos)
    cube.rotation.setFromVector3(rotation)
    //启用阴影投射
    cube.castShadow = true
    //将立方体添加到父级容器
    parent.add(cube)
}

// 移除立方体函数
const removeCube = (parent) => {
    parent.children.pop()
}