import extend from 'extend'

/**
 * 深度拷贝
 * @param {object,array} obj
 */
export const deepClone = obj => extend(true, Array.isArray(obj) ? [] : {}, obj)
