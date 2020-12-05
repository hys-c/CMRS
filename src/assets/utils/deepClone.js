export default function deepClone(obj, map = new WeakMap()) {
  if (obj instanceof RegExp) {
    return obj
  }
  if (obj instanceof Function) {
    return obj
  }
  if (obj instanceof Object) {
    const cloneObj = Array.isArray(obj) ? [] : {}
    if (map.get(cloneObj)) {
      return cloneObj
    }
    map.set(cloneObj)
    for (const i in obj) {
      cloneObj[i] = deepClone(obj[i], map)
    }
    return cloneObj
  } else {
    return obj
  }
}
