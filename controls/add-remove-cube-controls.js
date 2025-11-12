// 添加-移除-立方体控件.js
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils'
import * as THREE from 'three'
// 引入随机颜色
import { randomColor } from '../util/colorUtil.js'
// 引入随机向量
import { randomVector } from '../util/positionUtil.js'

export const initializeAddRemoveCubeControls = (gui, parent, material) => {
    const cubeConfig = {
        立方体数量: 1,
        立方体尺寸: 0.5,
        位置范围X: { min: -4, max: 4 },
        位置范围Y: { min: -3, max: 3 },
        位置范围Z: { min: -4, max: 4 }
    }
    
    const addRemoveProps = {
        添加单个立方体: () => addCube(parent, material, cubeConfig.立方体尺寸),
        添加多个立方体: () => {
            for (let i = 0; i < cubeConfig.立方体数量; i++) {
                addCube(parent, material, cubeConfig.立方体尺寸)
            }
        },
        移除最后一个立方体: () => removeLastCube(parent),
        清空所有立方体: () => clearAllCubes(parent)
    }
    
    // 创建配置文件夹
    const configFolder = gui.addFolder('立方体配置')
    configFolder.add(cubeConfig, '立方体数量', 1, 10, 1).name('批量添加数量')
    configFolder.add(cubeConfig, '立方体尺寸', 0.1, 2, 0.1).name('立方体尺寸')
    configFolder.add(cubeConfig.位置范围X, 'min', -10, 0, 0.5).name('X最小位置')
    configFolder.add(cubeConfig.位置范围X, 'max', 0, 10, 0.5).name('X最大位置')
    configFolder.add(cubeConfig.位置范围Y, 'min', -10, 0, 0.5).name('Y最小位置')
    configFolder.add(cubeConfig.位置范围Y, 'max', 0, 10, 0.5).name('Y最大位置')
    configFolder.add(cubeConfig.位置范围Z, 'min', -10, 0, 0.5).name('Z最小位置')
    configFolder.add(cubeConfig.位置范围Z, 'max', 0, 10, 0.5).name('Z最大位置')
    
    // 创建操作文件夹
    const actionFolder = gui.addFolder('立方体操作')
    actionFolder.add(addRemoveProps, '添加单个立方体')
    actionFolder.add(addRemoveProps, '添加多个立方体')
    actionFolder.add(addRemoveProps, '移除最后一个立方体')
    actionFolder.add(addRemoveProps, '清空所有立方体')
    actionFolder.add({ 当前立方体数量: () => parent.children.length }, '当前立方体数量').name('查看数量')
}

const addCube = (parent, material, size = 0.5) => {
    // 生成随机颜色
    const color = randomColor()
    
    // 在指定范围内生成随机位置向量
    const pos = randomVector({
        xRange: { fromX: -4, toX: 4 },
        yRange: { fromY: -3, toY: 3 },
        zRange: { fromZ: -4, toZ: 4 }
    })
    
    // 生成随机旋转角度（0到2π弧度）
    const rotation = randomVector({
        xRange: { fromX: 0, toX: Math.PI * 2 },
        yRange: { fromY: 0, toY: Math.PI * 2 },
        zRange: { fromZ: 0, toZ: Math.PI * 2 }
    })
    
    // 创建立方体几何体
    const geometry = new THREE.BoxGeometry(size, size, size)
    
    // 如果提供了材质参数则使用之，否则创建新的金属质感材质
    const cubeMaterial =
        material ??
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.1,
            metalness: 0.9
        })

    // 根据材质类型创建网格对象
    let cube
    if (Array.isArray(cubeMaterial)) {
        cube = SceneUtils.createMultiMaterialObject(geometry, cubeMaterial)
    } else {
        cube = new THREE.Mesh(geometry, cubeMaterial)
    }
    
    // 为立方体设置唯一名称
    cube.name = '立方体-' + parent.children.length
    
    // 设置位置和旋转
    cube.position.copy(pos)
    cube.rotation.setFromVector3(rotation)
    
    // 启用阴影投射
    cube.castShadow = true
    
    // 将立方体添加到父级容器
    parent.add(cube)
    
    console.log(`已添加${cube.name}, 位置: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}), 尺寸: ${size}`)
    
    return cube
}

// 移除最后一个立方体
const removeLastCube = (parent) => {
    if (parent.children.length > 0) {
        const removedCube = parent.children[parent.children.length - 1]
        parent.remove(removedCube)
        console.log(`已移除${removedCube.name}`)
        return removedCube
    } else {
        console.log('没有立方体可移除')
        return null
    }
}

// 清空所有立方体
const clearAllCubes = (parent) => {
    const cubeCount = parent.children.length
    // 移除所有名称为"立方体-"开头的对象
    for (let i = parent.children.length - 1; i >= 0; i--) {
        if (parent.children[i].name.startsWith('立方体-')) {
            parent.remove(parent.children[i])
        }
    }
    console.log(`已清空所有立方体，共移除${cubeCount}个`)
}