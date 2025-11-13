// 自定义着色器材质
import * as THREE from 'three'
import { initScene } from '../bootstrap/bootstrap'
import { intializeRendererControls } from '../controls/renderer-control'
import { getObjectsKeys } from '../util'
import { initializeSceneControls } from '../controls/scene-controls'

import GUI from 'lil-gui'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
// 导入着色器代码
import fs_simple from './glsl/fs-simple.glsl?raw'
import vs_simple from './glsl/vs-simple.glsl?raw'
import fs_night_sky from './glsl/fs-night-sky.glsl?raw'
import vs_noop from './glsl/vs-noop.glsl?raw'
import fs_color_shift from './glsl/fs-color-shift.glsl?raw'
import vs_ripple from './glsl/vs-simple-ripple.glsl?raw'

const props = {
    backgroundColor: 0xffffff,
    fogColor: 0xffffff
}

const gui = new GUI()
// 创建几何体和材质函数
const getVertexShaderPlane = (vertexShader, fragmentShader) => {
    // 创建环面扭结几何体
    const geometry = new THREE.TorusKnotGeometry(2, 0.5, 200, 20)
    // 使用自定义着色器材质
    const material = new CustomShaderMaterial({
        baseMaterial: THREE.MeshStandardMaterial,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // 定义 uniforms：time（时间）和 resolution（分辨率）
        uniforms: {
            time: { value: 0.2 },
            resolution: { value: new THREE.Vector2() }
        },
        flatShading: false,
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.9
    })

    return { geometry, material }
}

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
    camera.position.set(-3, 8, 2)
    camera.near = 1
    camera.far = 100

    camera.updateProjectionMatrix()
    orbitControls.update()

    const props = {
        vertexShader: 'vs_simple',
        fragmentShader: 'fs_simple',
        timeIncrement: 0.005
    }

    let { geometry, material } = getVertexShaderPlane(vs_simple, fs_simple)
    let mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true

    const shaderFolder = gui.addFolder('Shaders')
    const vertexShaders = { vs_simple: vs_simple, vs_noop: vs_noop, vs_ripple: vs_ripple }
    const fragmentShaders = { fs_simple: fs_simple, fs_night_sky: fs_night_sky, fs_color_shift: fs_color_shift }

    shaderFolder.add(props, 'fragmentShader', getObjectsKeys(fragmentShaders)).onChange(() => {
        scene.remove(mesh)
            ; ({ geometry, material } = getVertexShaderPlane(
                vertexShaders[props.vertexShader],
                fragmentShaders[props.fragmentShader]
            ))
        mesh = new THREE.Mesh(geometry, material)
        mesh.receiveShadow = true
        scene.add(mesh)
    })
    shaderFolder.add(props, 'vertexShader', getObjectsKeys(vertexShaders)).onChange(() => {
        scene.remove(mesh)
            ; ({ geometry, material } = getVertexShaderPlane(
                vertexShaders[props.vertexShader],
                fragmentShaders[props.fragmentShader]
            ))
        mesh = new THREE.Mesh(geometry, material)
        mesh.receiveShadow = true
        scene.add(mesh)
    })
    shaderFolder.add(props, 'timeIncrement', -0.01, 0.01, 0.001)

    scene.add(mesh)

    function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        orbitControls.update()
        material.uniforms.time.value += props.timeIncrement
    }
    animate()

    console.log(material)

    intializeRendererControls(gui, renderer)
    initializeSceneControls(gui, scene, false, false)
})