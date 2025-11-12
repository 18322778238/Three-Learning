// 场景控制
import * as THREE from 'three'
// 初始化纹理加载器
const textureLoader = new THREE.TextureLoader()
// 场景属性对象工厂函数
const propertiesObject = (scene) => ({
    // overrideMaterial: 切换法线材质覆盖，用于调试模型结构
    overrideMaterial: {
        toggle: () => {
            if (scene.overrideMaterial !== null) {
                scene.overrideMaterial = null
            } else {
                scene.overrideMaterial = new THREE.MeshNormalMaterial()
            }
        }
    },
    // backGround: 背景设置，默认白色
    backGround: '白色',
    // environment: 切换环境贴图，用于全局光照和反射
    environment: {
        toggle: () => {
            if (scene.environment !== null) {
                scene.environment = null
            } else {
                textureLoader.load('/assets/equi.jpeg', (loaded) => {
                    loaded.mapping = THREE.EquirectangularReflectionMapping
                    scene.environment = loaded
                })
            }
        }
    }
})

// 雾效属性工厂函数
const fogProperties = (fog) => ({
    // color: 雾的颜色
    color: 0xffffff,
    // near: 雾开始的距离
    near: fog.near,
    // far: 雾结束的距离
    far: fog.far
})

// 初始化场景控制器
export const initializeSceneControls = (gui, scene, fogEnabled, isOpen) => {
    const props = propertiesObject(scene)
    const sceneControls = gui.addFolder('场景设置')
    // 背景控制
    sceneControls
        .add(props, 'backGround', ['白色', '黑色', '无背景', '纯色', '纹理', '立方体贴图'])
        .name('背景类型')
        .onChange((event) => handleBackgroundChange(event, scene))
    // 材质覆盖控制
    sceneControls.add(props.overrideMaterial, 'toggle').name('切换覆盖材质')
    // 环境贴图控制
    sceneControls.add(props.environment, 'toggle').name('切换环境贴图')
    // 雾效控制
    if (fogEnabled) {
        const fogColor = new THREE.Color(0xffffff)
        const fog = new THREE.Fog(fogColor, 1, 20)
        scene.fog = fog
        const fogProps = fogProperties(fog)
        const fogControls = sceneControls.addFolder('雾效设置')
        fogControls.addColor(fogProps, 'color').name('雾颜色')
        fogControls.add(fogProps, 'near', 0, 10, 0.1).name('雾开始距离')
        fogControls.add(fogProps, 'far', 0, 100, 0.1).name('雾结束距离')

        fogControls.onChange(() => {
            fog.color = fogColor.setHex(fogProps.color)
            fog.near = fogProps.near
            fog.far = fogProps.far
        })
    }

    isOpen ? sceneControls.open() : sceneControls.close()
}
// 背景变化处理函数
const handleBackgroundChange = (setting, scene) => {
    switch (setting) {
        case '白色':
            scene.background = new THREE.Color(0xffffff)
            break
        case '黑色':
            scene.background = new THREE.Color(0x000000)
            break
        case '无背景':
            scene.background = null
            break
        case '纯色':
            scene.background = new THREE.Color(0x44ff44)// 绿色
            break
        case '纹理':
            textureLoader.load('/assets/textures/wood/abstract-antique-backdrop-164005.jpg', (loaded) => {
                loaded.encoding = THREE.sRGBEncoding
                scene.background = loaded
                scene.environment = null // 清除环境贴图避免冲突
            })
            break
        case '立方体贴图':
            textureLoader.load('/assets/equi.jpeg', (loaded) => {
                loaded.mapping = THREE.EquirectangularReflectionMapping
                scene.background = loaded
                scene.environment = loaded  // 同时设置为环境贴图
            })
            break
        default:
            break
    }
}