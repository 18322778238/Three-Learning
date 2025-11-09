import * as THREE from 'three'

// 视角名称
const perspectiveName = 'Perspective Camera'
// 正交名称
const orthoName = 'Orthographic Camera'

// TODO: check the lookat
// 视线方向配置函数:返回一个包含默认视线目标点坐标的对象,用于控制相机注视的目标位置
const lookAtProps = () => ({
    lookAtX: 0,
    lookAtY: 0,
    lookAtZ: 0
})

// 透视相机控制初始化
export const initializePerspectiveCameraControls = (camera, gui, orbitControls, isOpen) => {
    // 初始化控制参数对象，从相机当前设置获取初始值
    const vectorProps = lookAtProps(camera)
    const props = {
        fov: camera.fov,                    // 视野角度
        aspect: camera.aspect,              // 宽高比
        near: camera.near,                  // 近裁剪面
        far: camera.far,                    // 远裁剪面
        zoom: camera.zoom                   // 缩放级别
    }
    // 清理可能已存在的同名文件夹，避免重复
    removeIfPresent(gui, perspectiveName)
    removeIfPresent(gui, orthoName)
    // 添加各种参数控制器
    const cameraFolder = gui.addFolder(perspectiveName)
    // 视野角度，范围0-180，步长1
    const fovCtrl = cameraFolder.add(props, 'fov', 0, 180, 1).onChange(updateCamera) 
    // 宽高比，范围0-10，步长0.1
    const aspectCtrl = cameraFolder.add(props, 'aspect', 0, 10, 0.1).onChange(updateCamera)              
    // 近裁剪面，范围0-20，步长0.1
    const nearCtrl = cameraFolder.add(props, 'near', 0, 20, 0.1).onChange(updateCamera) 
    // 远裁剪面，范围5-100，步长0.1                
    const farCtrl = cameraFolder.add(props, 'far', 5, 100, 0.1).onChange(updateCamera)
    // 缩放，范围-1到10，步长0.1                 
    const zoomCtrl = cameraFolder.add(props, 'zoom', 0.1, 10, 0.1).onChange(updateCamera)                

    cameraFolder.add(vectorProps, 'lookAtX', -10, 10, 0.1).onChange(updateLookAt)
    cameraFolder.add(vectorProps, 'lookAtY', -10, 10, 0.1).onChange(updateLookAt)
    cameraFolder.add(vectorProps, 'lookAtZ', -10, 10, 0.1).onChange(updateLookAt)

    function updateCamera() {
        camera.fov = props.fov
        camera.aspect = props.aspect
        camera.near = props.near
        camera.far = props.far
        camera.zoom = props.zoom
        camera.updateProjectionMatrix()
    }

    function updateLookAt() {
        orbitControls.target.set(vectorProps.lookAtX, vectorProps.lookAtY, vectorProps.lookAtZ)
        orbitControls.update()
    }

    if (isOpen) cameraFolder.open()
}

// 正交相机控制初始化
export const initializeOrthographicCameraControls = (camera, gui, orbitControls, isOpen = false) => {
    const vectorProps = lookAtProps()

    const props = {
        left: camera.left,              // 左裁剪面
        right: camera.right,            // 右裁剪面
        top: camera.top,                // 上裁剪面
        bottom: camera.bottom,          // 下裁剪面
        near: camera.near,              // 近裁剪面
        far: camera.far,                // 远裁剪面
        zoom: camera.zoom               // 缩放级别
    }

    removeIfPresent(gui, perspectiveName)
    removeIfPresent(gui, orthoName)

    const cameraFolder = gui.addFolder(orthoName)
    cameraFolder.add(props, 'left', -400, -10, 1).onChange(updateCamera)
    cameraFolder.add(props, 'right', 10, 400, 1).onChange(updateCamera)
    cameraFolder.add(props, 'top', 0, 200, 1).onChange(updateCamera)
    cameraFolder.add(props, 'bottom', -200, 0, 1).onChange(updateCamera)
    cameraFolder.add(props, 'near', 0.1, 10, 0.1).onChange(updateCamera) // 修正near范围
    cameraFolder.add(props, 'far', 1, 100, 1).onChange(updateCamera)
    cameraFolder.add(props, 'zoom', 0.1, 10, 0.1).onChange(updateCamera) // 修正zoom范围
    
    cameraFolder.add(vectorProps, 'lookAtX', -10, 10, 0.1).onChange(updateLookAt)
    cameraFolder.add(vectorProps, 'lookAtY', -10, 10, 0.1).onChange(updateLookAt)
    cameraFolder.add(vectorProps, 'lookAtZ', -10, 10, 0.1).onChange(updateLookAt)

    // 变化监听和更新
    function updateCamera() {
        camera.left = props.left
        camera.right = props.right
        camera.top = props.top
        camera.bottom = props.bottom
        camera.near = props.near
        camera.far = props.far
        camera.zoom = props.zoom
        camera.updateProjectionMatrix()
    }

    function updateLookAt() {
        orbitControls.target.set(vectorProps.lookAtX, vectorProps.lookAtY, vectorProps.lookAtZ)
        orbitControls.update()
    }

    if (isOpen) cameraFolder.open()
}

// 递归遍历所有GUI文件夹，删除指定名称的文件夹
const removeIfPresent = (gui, name) => {
    // 简单实现：直接尝试删除，如果不存在会静默失败
    try {
        const folder = gui.__folders[name]
        if (folder) {
            gui.removeFolder(folder)
        }
    } catch (e) {
        // 文件夹不存在，忽略错误
    }
}