import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial } from '../controls/material-controls'

// 尝试不同的导入方式
let noise;
try {
  // 方式1：默认导入
  import('perlin-noise').then(module => {
    noise = module.createNoise ? module.createNoise() : module.default;
  });
} catch (error) {
  console.log('第一种导入方式失败:', error);
}

// 创建canvas用于生成噪声纹理
var canvas = document.createElement('canvas')
canvas.className = 'myClass'
canvas.style.cssText = `
  position: absolute;
  top: 10px;
  left: 10px;
  border: 1px solid #ccc;
  z-index: 1000;
`
canvas.setAttribute('width', 512)
canvas.setAttribute('height', 512)
document.body.append(canvas)

const ctx = canvas.getContext('2d')

// 延迟生成纹理，确保噪声函数已加载
setTimeout(() => {
  generateNoiseTexture(50);
  initializeScene();
}, 100);

function generateNoiseTexture(frequency = 50, useNewNoise = false) {
  let currentNoise = noise;
  
  // 如果需要新的噪声模式，创建新的噪声函数
  if (useNewNoise && window.PerlinNoise) {
    currentNoise = window.PerlinNoise.createNoise ? 
      window.PerlinNoise.createNoise() : 
      window.PerlinNoise;
  }
  
  // 如果还是没有噪声函数，使用备用方案
  if (!currentNoise) {
    console.warn('柏林噪声未正确加载，使用备用随机函数');
    currentNoise = (x, y) => Math.random() * 2 - 1;
  }
  
  for (var x = 0; x < 512; x++) {
    for (var y = 0; y < 512; y++) {
      var value = currentNoise(x / frequency, y / frequency)
      var colorValue = Math.floor(((value + 1) / 2) * 255)
      ctx.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`
      ctx.fillRect(x, y, 1, 1)
    }
  }
}

function initializeScene() {
  // 创建纹理并设置参数
  const bumpTexture = new THREE.CanvasTexture(canvas)
  bumpTexture.wrapS = THREE.RepeatWrapping
  bumpTexture.wrapT = THREE.RepeatWrapping
  bumpTexture.needsUpdate = true

  // 创建使用噪声纹理作为凹凸贴图的材质
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    bumpMap: bumpTexture,
    bumpScale: 0.1
  })

  const props = {
    material: material,
    withMaterialGui: true,
    provideGui: (gui, mesh, material) => {
      initializeGuiMeshPhongMaterial(gui, mesh, material)

      // 移除原有的纹理文件夹（如果有）
      if (gui.folders) {
        gui.folders.map((f) => {
          if (f._title === 'Textures') {
            f.destroy()
          }
        })
      }

      const wrappingTypes = {
        'Repeat Wrapping': THREE.RepeatWrapping,
        'Clamp To Edge': THREE.ClampToEdgeWrapping,
        'Mirrored Repeat': THREE.MirroredRepeatWrapping
      }

      const textureProps = {
        bumpScale: 0.1,
        repeatX: 1,
        repeatY: 1,
        wrappingType: THREE.RepeatWrapping,
        noiseFrequency: 50
      }

      const textureFolder = gui.addFolder('Perlin Noise Texture')
      
      textureFolder.add(textureProps, 'bumpScale', 0, 1, 0.01).onChange((value) => {
        material.bumpScale = value
      })
      
      textureFolder.add(textureProps, 'repeatX', 0.1, 5, 0.1).onChange(() => {
        material.bumpMap.repeat.set(textureProps.repeatX, textureProps.repeatY)
        material.bumpMap.needsUpdate = true
      })
      
      textureFolder.add(textureProps, 'repeatY', 0.1, 5, 0.1).onChange(() => {
        material.bumpMap.repeat.set(textureProps.repeatX, textureProps.repeatY)
        material.bumpMap.needsUpdate = true
      })
      
      textureFolder.add(textureProps, 'wrappingType', wrappingTypes).onChange((value) => {
        material.bumpMap.wrapS = value
        material.bumpMap.wrapT = value
        material.bumpMap.needsUpdate = true
      })
      
      textureFolder.add(textureProps, 'noiseFrequency', 10, 200, 1).name('Noise Freq').onChange((freq) => {
        generateNoiseTexture(freq)
        material.bumpMap.needsUpdate = true
      })
      
      textureFolder.add({
        regenerate: () => {
          generateNoiseTexture(textureProps.noiseFrequency, true)
          material.bumpMap.needsUpdate = true
        }
      }, 'regenerate').name('New Random Pattern')
      
      textureFolder.open()
    }
  }

  bootstrapMaterialScene(props).then()
}