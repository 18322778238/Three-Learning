// 3D文字几何体生成器
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

const props = {
  size: 10,
  height: 10,
  curveSegments: 12,
  bevelEnabled: false,
  bevelThickness: 0,
  bevelSize: 0,
  bevelOffset: 0,
  bevelSegments: 10
}

const updateGeometry = ({
  font,
  size,
  height,
  curveSegments,
  bevelEnabled,
  bevelThickness,
  bevelSize,
  bevelOffset,
  bevelSegments,
  amount
}) => {
  return new TextGeometry('Some Text', {
    font,
    size,
    height,
    curveSegments,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelOffset,
    bevelSegments,
    amount
  })
    .scale(0.2, 0.2, 0.2)
    .translate(-3, 0, 0)
}

new FontLoader()
  .loadAsync('/assets/fonts/helvetiker_regular.typeface.json')
  .then((font) => {
    // we can also create 2D shapes instead using  font.generateShapes
    bootstrapGeometryScene({
      geometry: updateGeometry({ font, ...props }),
      provideGui: (gui, mesh) => {
        const folder = gui.addFolder('文本几何体')
        folder.add(props, 'size', 1, 30, 1).name('大小').onChange(() => updateMesh(mesh, updateGeometry({ font, ...props })))
        folder.add(props, 'height', 1, 30, 1).name('高度').onChange(() => updateMesh(mesh, updateGeometry({ font, ...props })))
        folder
          .add(props, 'curveSegments', 1, 30, 1)
          .name('曲线段数')
          .onChange(() => updateMesh(mesh, updateGeometry({ font, ...props })))
        folder.add(props, 'bevelEnabled').name('是否开启斜面').onChange(() => updateMesh(mesh, updateGeometry({ font, ...props })))
        folder
          .add(props, 'bevelThickness', 0, 1, 0.01)
          .name('斜面厚度')
          .onChange(() => updateMesh(mesh, updateGeometry({ font, ...props })))
        folder.add(props, 'bevelSize', 0, 3, 0.01).name('斜面大小').onChange(() => updateMesh(mesh, updateGeometry({ font, ...props })))
        folder
          .add(props, 'bevelOffset', 0, 3, 0.01)
          .name('斜面偏移')
          .onChange(() => updateMesh(mesh, updateGeometry({ font, ...props })))
        folder
          .add(props, 'bevelSegments', 1, 30, 1)
          .name('斜面段数')
          .onChange(() => updateMesh(mesh, updateGeometry({ font, ...props })))
      }
    })
  })
  .then()