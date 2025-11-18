// 使用精灵和精灵材质进行简单渲染
import { bootstrapGeometryScene } from './util/standard-scene'
import * as THREE from 'three'

const material = new THREE.SpriteMaterial({ size: 0.1, color: 0xff0000 })

bootstrapGeometryScene({
  provideGui: () => {},
  material: material,
  hidefloor: true,
  isSprite: true,
  spritePosition: new THREE.Vector3(3, 2, 1)
}).then()