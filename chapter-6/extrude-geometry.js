// 2D 形状挤出(Extrude)成 3D 模型的交互式工具
import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const props = {
  amount: 10,
  curveSegments: 12,
  steps: 100,
  depth: true,
  bevelEnabled: false,
  bevelThickness: 0,
  bevelSize: 0,
  bevelOffset: 0,
  bevelSegments: 10
}

const drawShape = () => {
  // create a basic shape
  const shape = new THREE.Shape()
  // startpoint
  // straight line upwards
  shape.lineTo(10, 40)
  // the top of the figure, curve to the right
  shape.bezierCurveTo(15, 25, 25, 25, 30, 40)
  // spline back down
  shape.splineThru([new THREE.Vector2(32, 30), new THREE.Vector2(28, 20), new THREE.Vector2(30, 10)])
  // add 'eye' hole one
  const hole1 = new THREE.Path()
  hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true)
  shape.holes.push(hole1)
  // add 'eye hole 2'
  const hole2 = new THREE.Path()
  hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true)
  shape.holes.push(hole2)
  // add 'mouth'
  const hole3 = new THREE.Path()
  hole3.absarc(20, 16, 2, 0, Math.PI, true)
  shape.holes.push(hole3)

  return shape
}

const updateGeometry = ({
  curveSegments,
  steps,
  depth,
  bevelEnabled,
  bevelThickness,
  bevelSize,
  bevelOffset,
  bevelSegments,
  amount
}) => {
  return new THREE.ExtrudeGeometry(drawShape(), {
    curveSegments,
    steps,
    depth,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelOffset,
    bevelSegments,
    amount
  })
    .scale(0.2, 0.2, 0.2)
    .translate(-3, -3, 0)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('拉伸几何体')
    folder.add(props, 'curveSegments', 1, 30, 1).name('曲线分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'amount', 1, 40, 1).name('拉伸厚度').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'steps', 10, 300, 1).name('步长').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'depth').name('深度').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'bevelEnabled').name('是否开启斜面').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'bevelThickness', 0, 1, 0.01).name('斜面厚度').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'bevelSize', 0, 3, 0.01).name('斜面大小').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'bevelOffset', 0, 3, 0.01).name('斜面偏移').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'bevelSegments', 1, 30, 1).name('斜面分割').onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()