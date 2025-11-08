// 渲染器控制器模块
import * as THREE from "three";

// 枚举定义
const enums = {
    // 色调映射：6种不同的色调映射算法
    toneMappingOptions: {
        None: THREE.NoToneMapping,                      // 无色调映射
        Linear: THREE.LinearToneMapping,                // 线性色调映射
        Reinhard: THREE.ReinhardToneMapping,            // Reinhard色调映射算法
        Cineon: THREE.CineonToneMapping,                // 电影风格色调映射
        ACESFilmic: THREE.ACESFilmicToneMapping,        // ACES电影级色调映射
        Custom: THREE.CustomToneMapping,                // 自定义色调映射
    },
    // 阴影映射：4种阴影渲染技术
    shadowMapping: {
        Basic: THREE.BasicShadowMap,            // 基础阴影映射（性能好，质量低）
        PCFS: THREE.PCFShadowMap,               // 百分比渐近滤波阴影
        PCFSoft: THREE.PCFSoftShadowMap,        // 软阴影PCF
        VSM: THREE.VSMShadowMap,                // 方差阴影映射
    },
    // 输出编码：2种颜色编码方式
    outputEncodings: {
        Linear: THREE.LinearEncoding,           // 线性颜色编码
        sRGB: THREE.sRGBEncoding,               // sRGB颜色编码（伽马校正）
    },
};

// 属性获取器
const getPropertyHolder = (webGLRenderer) => {
    // 创建一个临时Color对象来存储当前清除颜色
    const clearColorHolder = new THREE.Color();
    // 从渲染器获取当前的清除颜色值
    webGLRenderer.getClearColor(clearColorHolder);

    const holder = {
        // main: 主要设置（输出编码）
        main: {
            outputEncoding: webGLRenderer.outputEncoding,       // 当前输出编码方式
        },
        // shadowMap: 阴影映射相关属性
        shadowMap: {
            enabled: webGLRenderer.shadowMap.enabled,           // 阴影是否启用
            autoUpdate: webGLRenderer.shadowMap.autoUpdate,     // 阴影自动更新
            needsUpdate: () => (webGLRenderer.shadowMap.needsUpdate = true),    // 强制阴影更新函数
            type: webGLRenderer.shadowMap.type,     // 当前阴影映射类型
        },
        // toneMapping: 色调映射和曝光
        toneMapping: {
            exposure: webGLRenderer.toneMappingExposure,        // 色调映射曝光值
            toneMapping: webGLRenderer.toneMapping,             // 当前色调映射算法
        },
        // clearSettings: 清除设置和背景色
        clearSettings: {
            autoClear: webGLRenderer.autoClear,                 // 是否自动清除画布
            clearColor: clearColorHolder.getStyle(),            // 清除颜色（CSS格式）
        },
        // advanced: 高级渲染选项
        advanced: {
            autoClearDepth: webGLRenderer.autoClearDepth,                       // 自动清除深度缓冲区
            autoClearStencil: webGLRenderer.autoClearStencil,                   // 自动清除模板缓冲区
            checkShaderErrors: webGLRenderer.debug.checkShaderErrors,           // 检查着色器错误
            sortObjects: webGLRenderer.sortObjects,                             // 对象排序渲染
            localClippingEnabled: webGLRenderer.localClippingEnabled,           // 局部裁剪启用
            physicallyCorrectLights: webGLRenderer.physicallyCorrectLights,     // 物理正确光照
        },
    };

    return holder;
};

// 初始化渲染器控制器
export const intializeRendererControls = (gui, webGLRenderer) => {
    // 获取当前渲染器属性状态
    const propertiesObject = getPropertyHolder(webGLRenderer);
    // 在GUI中创建"WebGLRenderer"文件夹
    const rendererFolder = gui.addFolder("WebGLRenderer");

    // 监听文件夹内任何控件的改变事件,当任何值改变时，调用更新函数应用更改
    rendererFolder.onChange((_) => {
        updateWebGLRendererProperties(webGLRenderer, propertiesObject);
    });
    // 添加输出编码下拉选择控件,使用之前定义的枚举作为选项
    rendererFolder.add(
        propertiesObject.main,
        "outputEncoding",
        enums.outputEncodings
    );
    // // 阴影设置子文件夹
    const shadowFolder = rendererFolder.addFolder("Shadow");                //创建阴影设置子文件夹
    shadowFolder.add(propertiesObject.shadowMap, "enabled");                //添加阴影启用/禁用复选框
    shadowFolder.add(propertiesObject.shadowMap, "autoUpdate");             //添加阴影自动更新复选框
    shadowFolder.add(propertiesObject.shadowMap, "needsUpdate");            //添加手动更新阴影按钮（触发needsUpdate函数）
    // 添加阴影类型选择（但禁用了，因为运行时不能更改）
    shadowFolder
        .add(propertiesObject.shadowMap, "type", enums.shadowMapping)
        .enable(false); // 运行时无法更新阴影映射类型

    // 色调映射子文件夹
    // 创建色调映射子文件夹
    const toneMappingFolder = rendererFolder.addFolder("ToneMapping");
    // 添加曝光度滑块控件（范围0-2）
    toneMappingFolder.add(propertiesObject.toneMapping, "exposure", 0, 2);
    // 添加色调映射算法下拉选择
    toneMappingFolder.add(
        propertiesObject.toneMapping,
        "toneMapping",
        enums.toneMappingOptions
    );

    // 清除设置子文件夹
    // 创建清除设置子文件夹
    const clearSettingsFolder = rendererFolder.addFolder("clearSettings");
    // 添加自动清除复选框
    clearSettingsFolder.add(propertiesObject.clearSettings, "autoClear");
    // 添加颜色选择器用于设置清除颜色
    clearSettingsFolder.addColor(propertiesObject.clearSettings, "clearColor");
    // 默认关闭渲染器文件夹（保持界面整洁）
    rendererFolder.close();
};

// 属性更新函数
const updateWebGLRendererProperties = (webGLRenderer, propertyHolder) => {
    webGLRenderer.shadowMap.enabled = propertyHolder.shadowMap.enabled;
    webGLRenderer.shadowMap.autoUpdate = propertyHolder.shadowMap.autoUpdate;
    webGLRenderer.shadowMap.needsUpdate = propertyHolder.shadowMap.needsUpdate;
    webGLRenderer.toneMapping = propertyHolder.toneMapping.toneMapping;
    webGLRenderer.toneMappingExposure = propertyHolder.toneMapping.exposure;
    webGLRenderer.autoClear = propertyHolder.clearSettings.autoClear;
    webGLRenderer.setClearColor(propertyHolder.clearSettings.clearColor);
    webGLRenderer.outputEncoding = propertyHolder.main.outputEncoding;

    webGLRenderer.needsUpdate = true;
};