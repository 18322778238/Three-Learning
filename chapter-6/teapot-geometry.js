// 犹他茶壶(Utah Teapot) 3D模型生成器
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry'

const props = {
  size: 1,
  segments: 20,
  bottom: true,
  lid: true,
  body: true,
  fitLid: true,
  blinn: true // aspects
}

const updateGeometry = ({ size, segments, bottom, lid, body, fitLid, blinn }) => {
  return new TeapotGeometry(size, segments, bottom, lid, body, fitLid, blinn)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('茶壶几何形状')
    folder.add(props, 'size', 0, 10, 0.01).name('大小').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'segments', 1, 30, 1).name('分割数').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'bottom', 0, 10, 0.01).name('底部').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'lid', 1, 20, 1).name('盖子').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'body', 0, 3, 0.01).name('主体').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'fitLid', 0, 3, 0.01).name('盖子').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'blinn', 0, 3, 0.01).name('Blinn').onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()