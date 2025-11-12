// 灯光控制器
import * as THREE from "three";

export const initializeAmbientLightControls = (gui, light) => {
    const colorHolder = new THREE.Color(light.color);

    const ambientLightProps = {
        color: colorHolder.getStyle(),
        intensity: light.intensity,
    };

    const ambienLightFolder = gui.addFolder("环境光");
    ambienLightFolder
        .add(ambientLightProps, "intensity", 0, 5, 0.1)
        .name("光照强度")
        .onChange((i) => (light.intensity = i));
    ambienLightFolder.addColor(ambientLightProps, "color")
        .name("光照颜色")
        .onChange((c) => {
            light.color.setStyle(c);
        });
};