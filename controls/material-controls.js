import * as THREE from 'three'
import { getObjectsKeys } from '../util/index.js'
import { visitChildren } from '../util/modelUtil.js'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper'

// ========== 中文标签映射 ==========
const chineseLabels = {
  // 材质类型
  'THREE.Material': '基础材质属性',
  'THREE.MeshStandardMaterial': '标准材质',
  'THREE.MeshPhysicalMaterial': '物理材质',
  'THREE.MeshBasicMaterial': '基础材质',
  'THREE.MeshLambertMaterial': '朗伯材质',
  'THREE.MeshPhongMaterial': '冯氏材质',
  'THREE.MeshToonMaterial': '卡通材质',
  'THREE.LineBasicMaterial': '线基础材质',
  'THREE.LineDashedMaterial': '虚线材质',
  'THREE.PointsMaterial': '点材质',
  'THREE.SpriteMaterial': '精灵材质',
  'THREE.MeshDepthMaterial': '深度材质',
  'THREE.MeshNormalMaterial': '法线材质',
  
  // 材质属性
  'transparent': '透明',
  'opacity': '不透明度',
  'blending': '混合模式',
  'blendSrc': '混合源',
  'blendDst': '混合目标',
  'blendEquation': '混合方程',
  'depthTest': '深度测试',
  'depthWrite': '深度写入',
  'alphaTest': 'Alpha测试',
  'visible': '可见',
  'side': '渲染面',
  'wireframe': '线框模式',
  'vertexColors': '顶点颜色',
  'color': '颜色',
  'emissive': '自发光颜色',
  'emissiveIntensity': '自发光强度',
  'specular': '高光颜色',
  'shininess': '光泽度',
  'roughness': '粗糙度',
  'metalness': '金属度',
  'clearcoat': '清漆层',
  'clearcoatRoughness': '清漆粗糙度',
  'envMaps': '环境贴图',
  'map': '漫反射贴图',
  'combine': '组合方式',
  'reflectivity': '反射率',
  'refractionRatio': '折射率',
  'linewidth': '线宽',
  'scale': '缩放',
  'dashSize': '虚线长度',
  'gapSize': '间隔长度',
  'size': '尺寸',
  'sizeAttenuation': '尺寸衰减',
  'flatShading': '平面着色',
  'vertexHelpers': '顶点法线辅助'
}

const envMaps = (function () {
  const reflectionCube2 = new THREE.TextureLoader().load('/assets/equi.jpeg', (loaded) => {
    loaded.mapping = THREE.EquirectangularReflectionMapping
  })
  const refractionCube2 = new THREE.TextureLoader().load('/assets/equi.jpeg', (loaded) => {
    loaded.mapping = THREE.EquirectangularRefractionMapping
  })

  return {
    '无': null,
    '反射': reflectionCube2,
    '折射': refractionCube2
  }
})()

const textureLoader = new THREE.TextureLoader()
const diffuseMaps = (function () {
  const parquet = textureLoader.load('/assets/textures/wood/floor-parquet-pattern-172292.jpg')
  parquet.encoding = THREE.sRGBEncoding
  parquet.wrapS = THREE.RepeatWrapping
  parquet.wrapT = THREE.RepeatWrapping
  parquet.repeat.set(9, 1)

  const antique = textureLoader.load('/assets/textures/wood/abstract-antique-backdrop-164005.jpg')
  antique.encoding = THREE.sRGBEncoding
  antique.wrapS = THREE.RepeatWrapping
  antique.wrapT = THREE.RepeatWrapping
  antique.repeat.set(9, 1)

  const marble = textureLoader.load('/assets/textures/marble/marble_0008_color_2k.jpg')
  marble.encoding = THREE.sRGBEncoding
  marble.wrapS = THREE.RepeatWrapping
  marble.wrapT = THREE.RepeatWrapping

  const ground = textureLoader.load('/assets/textures/ground/ground_0036_color_1k.jpg')
  ground.encoding = THREE.sRGBEncoding
  ground.wrapS = THREE.RepeatWrapping
  ground.wrapT = THREE.RepeatWrapping

  return {
    '无': null,
    '古董木纹': antique,
    '拼花木地板': parquet,
    '大理石': marble,
    '地面纹理': ground
  }
})()

// 使用中文键名
const envMapKeys = ['无', '反射', '折射']
const diffuseMapKeys = ['无', '古董木纹', '拼花木地板', '大理石', '地面纹理']

const constants = {
  combine: {
    '相乘操作': THREE.MultiplyOperation,
    '混合操作': THREE.MixOperation,
    '相加操作': THREE.AddOperation
  },

  side: {
    '正面': THREE.FrontSide,
    '背面': THREE.BackSide,
    '双面': THREE.DoubleSide
  },

  blendingMode: {
    '无混合': THREE.NoBlending,
    '正常混合': THREE.NormalBlending,
    '相加混合': THREE.AdditiveBlending,
    '相减混合': THREE.SubtractiveBlending,
    '相乘混合': THREE.MultiplyBlending,
    '自定义混合': THREE.CustomBlending
  },

  equations: {
    '相加方程': THREE.AddEquation,
    '相减方程': THREE.SubtractEquation,
    '反向相减方程': THREE.ReverseSubtractEquation
  },

  destinationFactors: {
    '零因子': THREE.ZeroFactor,
    '一因子': THREE.OneFactor,
    '源颜色因子': THREE.SrcColorFactor,
    '一减源颜色因子': THREE.OneMinusSrcColorFactor,
    '源Alpha因子': THREE.SrcAlphaFactor,
    '一减源Alpha因子': THREE.OneMinusSrcAlphaFactor,
    '目标Alpha因子': THREE.DstAlphaFactor,
    '一减目标Alpha因子': THREE.OneMinusDstAlphaFactor
  },

  sourceFactors: {
    '目标颜色因子': THREE.DstColorFactor,
    '一减目标颜色因子': THREE.OneMinusDstColorFactor,
    '源Alpha饱和因子': THREE.SrcAlphaSaturateFactor
  }
}

const handleColorChange = (color) => {
  return function (value) {
    if (typeof value === 'string') {
      value = value.replace('#', '0x')
    }

    color.setHex(value)
  }
}

const initializeGuiMaterial = (gui, mesh, material) => {
  const regex = /THREE.*Material/
  const toRemove = []
  gui.folders.map((f) => {
    if (
      regex.test(f._title) ||
      f._title === 'THREE.Material' ||
      f._title === 'THREE.MeshBasicMaterial' ||
      f._title === 'THREE.LineBasicMaterial' ||
      f._title === 'THREE.MeshNormalMaterial'
    ) {
      toRemove.push(f)
    }
  })
  for (const p of toRemove) p.destroy()

  const folder = gui.addFolder(chineseLabels['THREE.Material'])

  folder.add(material, 'transparent')
    .name(chineseLabels['transparent'])
    .onChange(needsUpdate(material, mesh))
    
  folder.add(material, 'opacity', 0, 1).step(0.01)
    .name(chineseLabels['opacity'])
    
  folder.add(material, 'blending', constants.blendingMode)
    .name(chineseLabels['blending'])
    
  folder.add(material, 'blendSrc', constants.destinationFactors)
    .name(chineseLabels['blendSrc'])
    
  folder.add(material, 'blendDst', constants.destinationFactors)
    .name(chineseLabels['blendDst'])
    
  folder.add(material, 'blendEquation', constants.equations)
    .name(chineseLabels['blendEquation'])
    
  folder.add(material, 'depthTest')
    .name(chineseLabels['depthTest'])
    
  folder.add(material, 'depthWrite')
    .name(chineseLabels['depthWrite'])

  folder.add(material, 'alphaTest', 0, 1).step(0.01)
    .name(chineseLabels['alphaTest'])
    .onChange(needsUpdate(material, mesh))
    
  folder.add(material, 'visible')
    .name(chineseLabels['visible'])
    
  folder.add(material, 'side', constants.side)
    .name(chineseLabels['side'])
    .onChange(needsUpdate(material, mesh))

  return folder
}

export const initializeMeshDepthMaterial = (gui, mesh, material) => {
  const folder = gui.addFolder(chineseLabels['THREE.MeshDepthMaterial'])
  folder.add(material, 'wireframe')
    .name(chineseLabels['wireframe'])
}

export const initializeMeshNormalMaterial = (gui, mesh, material, scene) => {
  const props = {
    vertexHelpers: false
  }

  for (const child of scene.children) {
    if (child.name === 'VertexNormalHelper') scene.remove(child)
  }

  const folder = gui.addFolder(chineseLabels['THREE.MeshNormalMaterial'])
  folder.add(material, 'wireframe')
    .name(chineseLabels['wireframe'])
    
  folder.add(material, 'flatShading')
    .name(chineseLabels['flatShading'])
    .onChange(needsUpdate(material, mesh))
    
  folder.add(props, 'vertexHelpers')
    .name(chineseLabels['vertexHelpers'])
    .onChange((enabled) => {
      if (enabled) {
        visitChildren(mesh, (c) => {
          const helper = new VertexNormalsHelper(c, 0.1)
          helper.name = '顶点法线辅助器'
          scene.add(helper)
        })
      } else {
        for (const child of scene.children) {
          if (child.name === '顶点法线辅助器') scene.remove(child)
        }
      }
    })
}

export const initializeGuiMeshLambertMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ? title : chineseLabels['THREE.MeshLambertMaterial'])
  folder.addColor(data, 'emissive')
    .name(chineseLabels['emissive'])
    .onChange(handleColorChange(material.emissive))
    
  folder.add(material, 'emissiveIntensity', 0, 3)
    .name(chineseLabels['emissiveIntensity'])
    
  addRecurringMaterialProps(folder, data, material, mesh)
}

export const initializeGuiMeshPhongMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
    specular: material.specular.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ? title : chineseLabels['THREE.MeshPhongMaterial'])
  folder.addColor(data, 'emissive')
    .name(chineseLabels['emissive'])
    .onChange(handleColorChange(material.emissive))
    
  folder.add(material, 'emissiveIntensity', 0, 3)
    .name(chineseLabels['emissiveIntensity'])
    
  folder.addColor(data, 'specular')
    .name(chineseLabels['specular'])
    .onChange(handleColorChange(material.specular))
    
  folder.add(material, 'shininess', 0, 100)
    .name(chineseLabels['shininess'])
    
  addRecurringMaterialProps(folder, data, material, mesh)
}

export const initializeGuiMeshPhysicalMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ? title : chineseLabels['THREE.MeshPhysicalMaterial'])
  folder.addColor(data, 'emissive')
    .name(chineseLabels['emissive'])
    .onChange(handleColorChange(material.emissive))
    
  folder.add(material, 'emissiveIntensity', 0, 3)
    .name(chineseLabels['emissiveIntensity'])
    
  folder.add(material, 'roughness', 0, 1)
    .name(chineseLabels['roughness'])
    
  folder.add(material, 'metalness', 0, 1)
    .name(chineseLabels['metalness'])
    
  folder.add(material, 'clearcoat', 0, 1)
    .name(chineseLabels['clearcoat'])
    
  folder.add(material, 'clearcoatRoughness', 0, 1)
    .name(chineseLabels['clearcoatRoughness'])
    
  addRecurringMaterialProps(folder, data, material, mesh)
}

export const initializeGuiMeshStandardMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ? title : chineseLabels['THREE.MeshStandardMaterial'])
  folder.addColor(data, 'emissive')
    .name(chineseLabels['emissive'])
    .onChange(handleColorChange(material.emissive))
    
  folder.add(material, 'emissiveIntensity', 0, 3)
    .name(chineseLabels['emissiveIntensity'])
    
  folder.add(material, 'roughness', 0, 1)
    .name(chineseLabels['roughness'])
    
  folder.add(material, 'metalness', 0, 1)
    .name(chineseLabels['metalness'])
    
  addRecurringMaterialProps(folder, data, material, mesh, {})

  return folder
}

export const initializeGuiMeshBasicMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ? title : chineseLabels['THREE.MeshBasicMaterial'])
  addRecurringMaterialProps(folder, data, material, mesh, {})
}

export const initializeGuiLineBasicMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex()
  }

  const folder = gui.addFolder(title ? title : chineseLabels['THREE.LineBasicMaterial'])
  folder.addColor(data, 'color')
    .name(chineseLabels['color'])
    .onChange(handleColorChange(material.color))
    
  folder.add(material, 'vertexColors')
    .name(chineseLabels['vertexColors'])
    .onChange(needsUpdate(material, mesh))
    
  folder.add(material, 'linewidth', 0, 5, 0.1)
    .name(chineseLabels['linewidth'])
}

export const initializeGuiLineDashedMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex()
  }

  const folder = gui.addFolder(title ? title : chineseLabels['THREE.LineDashedMaterial'])
  folder.addColor(data, 'color')
    .name(chineseLabels['color'])
    .onChange(handleColorChange(material.color))
    
  folder.add(material, 'vertexColors')
    .name(chineseLabels['vertexColors'])
    .onChange(needsUpdate(material, mesh))
    
  folder.add(material, 'linewidth', 0, 5, 0.1)
    .name(chineseLabels['linewidth'])
    
  folder.add(material, 'scale', 0, 5, 0.1)
    .name(chineseLabels['scale'])
    
  folder.add(material, 'dashSize', 0, 5, 0.1)
    .name(chineseLabels['dashSize'])
    
  folder.add(material, 'gapSize', 0, 5, 0.1)
    .name(chineseLabels['gapSize'])
}

function addRecurringMaterialProps(folder, data, material, mesh, disableEnv) {
  folder.addColor(data, 'color')
    .name(chineseLabels['color'])
    .onChange(handleColorChange(material.color))
    
  folder.add(material, 'wireframe')
    .name(chineseLabels['wireframe'])
    
  folder.add(material, 'vertexColors')
    .name(chineseLabels['vertexColors'])
    .onChange(needsUpdate(material, mesh))
    
  if (disableEnv ?? true) {
    folder.add(data, 'envMaps', envMapKeys)
      .name(chineseLabels['envMaps'])
      .onChange(updateTexture(material, 'envMap', envMaps))
      
    folder.add(data, 'map', diffuseMapKeys)
      .name(chineseLabels['map'])
      .onChange(updateTexture(material, 'map', diffuseMaps))
      
    folder.add(material, 'combine', constants.combine)
      .name(chineseLabels['combine'])
      .onChange(updateCombine(material))
      
    if (material.reflectivity) {
      folder.add(material, 'reflectivity', 0, 1)
        .name(chineseLabels['reflectivity'])
    }
    
    if (material.refractionRatio !== undefined) {
      folder.add(material, 'refractionRatio', 0, 1)
        .name(chineseLabels['refractionRatio'])
    }
  }
}

export const initializeGuiMeshToonMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ? title : chineseLabels['THREE.MeshToonMaterial'])
  addRecurringMaterialProps(folder, data, material, mesh, false)
}

export const initializePointsMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    size: 1,
    sizeAttenuation: false,
    vertexColors: true
  }

  const folder = gui.addFolder(title ? title : chineseLabels['THREE.PointsMaterial'])
  folder.addColor(data, 'color')
    .name(chineseLabels['color'])
    .onChange(handleColorChange(material.color))
    
  folder.add(material, 'size', 0, 2, 0.01)
    .name(chineseLabels['size'])
    
  folder.add(material, 'sizeAttenuation')
    .name(chineseLabels['sizeAttenuation'])
    .onChange(needsUpdate(material, mesh))
    
  folder.add(material, 'vertexColors')
    .name(chineseLabels['vertexColors'])
    .onChange(needsUpdate(material, mesh))
}

export const initializeSpriteMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    size: 1,
    sizeAttenuation: false
  }

  const folder = gui.addFolder(title ? title : chineseLabels['THREE.SpriteMaterial'])
  folder.addColor(data, 'color')
    .name(chineseLabels['color'])
    .onChange(handleColorChange(material.color))
    
  folder.add(material, 'sizeAttenuation')
    .name(chineseLabels['sizeAttenuation'])
    .onChange(needsUpdate(material, mesh))
}

function needsUpdate(material, mesh) {
  return function () {
    material.side = parseInt(material.side)
    material.needsUpdate = true

    visitChildren(mesh, (c) => {
      if (c.geometry) {
        c.geometry.attributes.position.needsUpdate = true
        if (c.geometry.attributes.normal) c.geometry.attributes.normal.needsUpdate = true
        if (c.geometry.attributes.color) c.geometry.attributes.color.needsUpdate = true
      }
    })
  }
}

function updateTexture(material, materialKey, textures) {
  return function (key) {
    material[materialKey] = textures[key]
    material.needsUpdate = true
  }
}

function updateCombine(material) {
  return function (combine) {
    material.combine = parseInt(combine)
    material.needsUpdate = true
  }
}

export { initializeGuiMaterial }