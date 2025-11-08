// 助手控制器
import {
  axisHelper,
  axisHelperName,
  gridHelper,
  gridHelperName,
  polarGridHelper,
  polarGridHelperName,
} from "../helpers/helpers";

// 创建一个返回属性对象的工厂函数，包含三个辅助对象的切换控制：
// axisHelper: 直接实现切换逻辑
// gridHelper 和 polarGridHelper: 使用通用的 removeOrAddToScene 函数
const propertiesObject = (scene) => ({
  axisHelper: {
    toggle: () => {
      const currentHelper = scene.getObjectByName(axisHelperName);
      if (currentHelper) {
        scene.remove(currentHelper);
      } else {
        axisHelper(scene);
      }
    },
  },
  gridHelper: {
    toggle: () => removeOrAddToScene(gridHelperName, scene, gridHelper),
  },
  polarGridHelper: {
    toggle: () =>
      removeOrAddToScene(polarGridHelperName, scene, polarGridHelper),
  },
});

// 初始化助手控制器
// 创建 GUI 控制界面，添加 "Helpers" 文件夹，为每个辅助对象添加切换按钮，初始状态下关闭文件夹。
export const initializeHelperControls = (gui, scene) => {
  const props = propertiesObject(scene);
  const helpers = gui.addFolder("Helpers");
  //   helpers.add('axisHelperEnabled', propertiesObject)
  helpers.add(props.axisHelper, "toggle").name("Toggle AxesHelper");
  helpers.add(props.gridHelper, "toggle").name("Toggle GridHelper");
  helpers.add(props.polarGridHelper, "toggle").name("Toggle PolarGridHelper");

  helpers.close();
};

// 通用切换函数
// 通用的切换逻辑：1.通过名称在场景中查找对象 2.如果存在则移除，如果不存在则添加 3.添加调试日志输出当前对象
const removeOrAddToScene = (name, scene, addFn) => {
  const currentObject = scene.getObjectByName(name);
  console.log(currentObject);
  if (currentObject) {
    scene.remove(currentObject);
  } else {
    addFn(scene);
  }
};