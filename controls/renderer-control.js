// 渲染器控制器模块
import * as THREE from "three";

// 枚举定义 - 更新为最新Three.js版本
const enums = {
    // 色调映射：6种不同的色调映射算法
    toneMappingOptions: {
        '无色调映射': THREE.NoToneMapping,                      // 无色调映射
        '线性色调映射': THREE.LinearToneMapping,                // 线性色调映射
        'Reinhard色调映射': THREE.ReinhardToneMapping,            // Reinhard色调映射算法
        '电影色调映射': THREE.CineonToneMapping,                // 电影风格色调映射
        'ACES电影色调映射': THREE.ACESFilmicToneMapping,        // ACES电影级色调映射
        '自定义色调映射': THREE.CustomToneMapping,                // 自定义色调映射
    },
    // 阴影映射：4种阴影渲染技术
    shadowMapping: {
        '基础阴影映射': THREE.BasicShadowMap,            // 基础阴影映射（性能好，质量低）
        'PCF阴影映射': THREE.PCFShadowMap,               // 百分比渐近滤波阴影
        '软阴影PCF': THREE.PCFSoftShadowMap,        // 软阴影PCF
        '方差阴影映射': THREE.VSMShadowMap,                // 方差阴影映射
    },
    // 输出编码：更新为颜色空间
    outputEncodings: {
        '线性编码': THREE.LinearSRGBColorSpace,           // 线性颜色编码
        'sRGB编码': THREE.SRGBColorSpace,               // sRGB颜色编码（伽马校正）
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
            // 使用outputColorSpace替代旧的outputEncoding
            outputEncoding: webGLRenderer.outputColorSpace !== undefined ? webGLRenderer.outputColorSpace : webGLRenderer.outputEncoding,
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
            // 移除不存在的checkShaderErrors属性
            sortObjects: webGLRenderer.sortObjects,                             // 对象排序渲染
            localClippingEnabled: webGLRenderer.localClippingEnabled,           // 局部裁剪启用
            physicallyCorrectLights: webGLRenderer.physicallyCorrectLights !== undefined ? webGLRenderer.physicallyCorrectLights : false,     // 物理正确光照（安全检查）
        },
    };

    return holder;
};

// 初始化渲染器控制器
export const intializeRendererControls = (gui, webGLRenderer) => {
    // 获取当前渲染器属性状态
    const propertiesObject = getPropertyHolder(webGLRenderer);
    // 在GUI中创建"渲染器设置"文件夹
    const rendererFolder = gui.addFolder("渲染器设置");

    // 监听文件夹内任何控件的改变事件,当任何值改变时，调用更新函数应用更改
    rendererFolder.onChange((_) => {
        updateWebGLRendererProperties(webGLRenderer, propertiesObject);
    });
    
    // 添加输出编码下拉选择控件,使用之前定义的枚举作为选项
    const outputEncodingCtrl = rendererFolder.add(
        propertiesObject.main,
        "outputEncoding",
        enums.outputEncodings
    ).name("输出编码");
    
    // 阴影设置子文件夹
    const shadowFolder = rendererFolder.addFolder("阴影设置");                //创建阴影设置子文件夹
    shadowFolder.add(propertiesObject.shadowMap, "enabled").name("启用阴影");                //添加阴影启用/禁用复选框
    shadowFolder.add(propertiesObject.shadowMap, "autoUpdate").name("自动更新");             //添加阴影自动更新复选框
    shadowFolder.add(propertiesObject.shadowMap, "needsUpdate").name("强制更新阴影");            //添加手动更新阴影按钮（触发needsUpdate函数）
    // 添加阴影类型选择（但禁用了，因为运行时不能更改）
    shadowFolder
        .add(propertiesObject.shadowMap, "type", enums.shadowMapping)
        .name("阴影类型")
        .enable(false); // 运行时无法更新阴影映射类型

    // 色调映射子文件夹
    // 创建色调映射子文件夹
    const toneMappingFolder = rendererFolder.addFolder("色调映射");
    // 添加曝光度滑块控件（范围0-2）
    toneMappingFolder.add(propertiesObject.toneMapping, "exposure", 0, 2).name("曝光度");
    // 添加色调映射算法下拉选择
    toneMappingFolder.add(
        propertiesObject.toneMapping,
        "toneMapping",
        enums.toneMappingOptions
    ).name("色调映射算法");

    // 清除设置子文件夹
    // 创建清除设置子文件夹
    const clearSettingsFolder = rendererFolder.addFolder("清除设置");
    // 添加自动清除复选框
    clearSettingsFolder.add(propertiesObject.clearSettings, "autoClear").name("自动清除");
    // 添加颜色选择器用于设置清除颜色
    clearSettingsFolder.addColor(propertiesObject.clearSettings, "clearColor").name("清除颜色");
    
    // 高级设置子文件夹
    const advancedFolder = rendererFolder.addFolder("高级设置");
    advancedFolder.add(propertiesObject.advanced, "autoClearDepth").name("自动清除深度");
    advancedFolder.add(propertiesObject.advanced, "autoClearStencil").name("自动清除模板");
    // 移除不存在的checkShaderErrors
    advancedFolder.add(propertiesObject.advanced, "sortObjects").name("对象排序");
    advancedFolder.add(propertiesObject.advanced, "localClippingEnabled").name("局部裁剪");
    
    // 只在属性存在时添加物理正确光照控制
    if (propertiesObject.advanced.physicallyCorrectLights !== undefined) {
        advancedFolder.add(propertiesObject.advanced, "physicallyCorrectLights").name("物理正确光照");
    }
    
    // 默认关闭渲染器文件夹（保持界面整洁）
    rendererFolder.close();
};

// 属性更新函数
const updateWebGLRendererProperties = (webGLRenderer, propertyHolder) => {
    webGLRenderer.shadowMap.enabled = propertyHolder.shadowMap.enabled;
    webGLRenderer.shadowMap.autoUpdate = propertyHolder.shadowMap.autoUpdate;
    
    // 设置输出编码/颜色空间
    if (webGLRenderer.outputColorSpace !== undefined) {
        webGLRenderer.outputColorSpace = propertyHolder.main.outputEncoding;
    } else {
        webGLRenderer.outputEncoding = propertyHolder.main.outputEncoding;
    }
    
    webGLRenderer.toneMapping = propertyHolder.toneMapping.toneMapping;
    webGLRenderer.toneMappingExposure = propertyHolder.toneMapping.exposure;
    webGLRenderer.autoClear = propertyHolder.clearSettings.autoClear;
    webGLRenderer.setClearColor(propertyHolder.clearSettings.clearColor);

    // 高级属性设置
    webGLRenderer.autoClearDepth = propertyHolder.advanced.autoClearDepth;
    webGLRenderer.autoClearStencil = propertyHolder.advanced.autoClearStencil;
    webGLRenderer.sortObjects = propertyHolder.advanced.sortObjects;
    webGLRenderer.localClippingEnabled = propertyHolder.advanced.localClippingEnabled;
    
    if (webGLRenderer.physicallyCorrectLights !== undefined) {
        webGLRenderer.physicallyCorrectLights = propertyHolder.advanced.physicallyCorrectLights;
    }

    // 标记渲染器需要更新
    webGLRenderer.needsUpdate = true;
};