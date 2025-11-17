//  3D 凸包生成和可视化 的交互式场景
import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'

const generatePoints = () => {
  const spGroup = new THREE.Object3D()
  spGroup.name = 'spGroup'
  const points = []

  // 生成20个在 [-5, 5] 范围内的随机点
  for (let i = 0; i < 20; i++) {
    const randomX = -5 + Math.round(Math.random() * 10)
    const randomY = -5 + Math.round(Math.random() * 10)
    const randomZ = -5 + Math.round(Math.random() * 10)
    points.push(new THREE.Vector3(randomX, randomY, randomZ))
  }

  // 为每个点创建红色小球用于可视化
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: false })
  points.forEach(function (point) {
    const spGeom = new THREE.SphereGeometry(0.04)
    const spMesh = new THREE.Mesh(spGeom, material)
    spMesh.position.copy(point)
    spGroup.add(spMesh)
  })

  return {
    spGroup,
    points
  }
}

const updateGeometry = (scene) => {
  const { spGroup, points } = generatePoints()
  if (scene) {
    const maybeSpGroup = scene.getObjectByName('spGroup')
    if (maybeSpGroup) scene.remove(maybeSpGroup)
    scene.add(spGroup)
  }

  const convexGeometry = new ConvexGeometry(points)
  return convexGeometry
}

// 创建初始几何体
const geometry = updateGeometry()

// 启动场景
bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh, scene) => {
    updateMesh(mesh, updateGeometry(scene))
    const folder = gui.addFolder('凸包几何体')
    folder.add({ redraw: () => updateMesh(mesh, updateGeometry(scene)) }, 'redraw')
  }
}).then()