// 模型工具函数
// 递归遍历子对象，递归遍历3D对象树，对每个叶子节点执行回调函数
// 接收两个参数：要遍历的对象object和回调函数fn
export const visitChildren = (object, fn) => {
    if (object.children && object.children.length > 0) {
        for (const child of object.children) {
            visitChildren(child, fn)
        }
    } else {
        fn(object)
    }
}

// 应用阴影和深度写入设置：为3D对象树中的所有叶子节点启用阴影投射/接收和深度写入
export const applyShadowsAndDepthWrite = (object) => {
    visitChildren(object, (child) => {
        // 检查子对象是否有材质属性
        if (child.material) {
            child.material.depthWrite = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

// 按名称查找子对象
export const findChild = (object, name) => {
    if (object.children && object.children.length > 0) {
        for (const child of object.children) {
            if (name === child.name) {
                return child
            } else {
                // 在当前子对象的子树中继续搜索
                const res = findChild(child, name)
                if (res) {
                    return res
                }
            }
        }
    } else {
        // 当前对象没有子对象的时候直接检查当前对象名称是否匹配目标名称
        if (name === object.name) {
            return object
        } else {
            return undefined
        }
    }
}