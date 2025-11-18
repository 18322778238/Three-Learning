// 管道几何体(TubeGeometry)生成器，通过沿着3D曲线路径挤出圆形截面来创建管道状的3D模型。
import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import { TubeGeometry } from 'three'

const props = {
  numberOfPoints: 20,
  tubularSegments: 100,
  radius: 1,
  radiusSegments: 10,
  closed: false
}

const generatePoints = (numberOfPoints) => {
  const spGroup = new THREE.Object3D()
  spGroup.name = 'spGroup'
  const points = []

  for (let i = 0; i < numberOfPoints; i++) {
    var randomX = -10 + Math.round(Math.random() * 20)
    var randomY = -5 + Math.round(Math.random() * 10)
    var randomZ = -10 + Math.round(Math.random() * 10)

    points.push(new THREE.Vector3(randomX, randomY, randomZ))
  }

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

const updateGeometry = ({ numberOfPoints, tubularSegments, radius, radiusSegments, closed }, scene) => {
  const { spGroup, points } = generatePoints(numberOfPoints)
  if (scene) {
    const maybeSpGroup = scene.getObjectByName('spGroup')
    if (maybeSpGroup) scene.remove(maybeSpGroup)
    scene.add(spGroup)
  }

  const tubeGeometry = new TubeGeometry(
    new THREE.CatmullRomCurve3(points),
    tubularSegments,
    radius,
    radiusSegments,
    closed
  )

  return tubeGeometry
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh, scene) => {
    updateMesh(mesh, updateGeometry(props, scene))
    const folder = gui.addFolder('管道几何体')
    folder.add(props, 'numberOfPoints', 0, 40, 1).name('点数').onChange(() => updateMesh(mesh, updateGeometry(props, scene)))
    folder.add(props, 'tubularSegments', 0, 400, 1).name('切片数').onChange(() => updateMesh(mesh, updateGeometry(props, scene)))
    folder.add(props, 'radius', 0, 2, 0.01).name('半径').onChange(() => updateMesh(mesh, updateGeometry(props, scene)))
    folder.add(props, 'radiusSegments', 0, 40, 1).name('半径切片数').onChange(() => updateMesh(mesh, updateGeometry(props, scene)))
    folder.add(props, 'closed').name('闭合').onChange(() => updateMesh(mesh, updateGeometry(props, scene)))
  }
}).then()