export const util = {
  isPromise: (val) => {
    if (val !== null && typeof val === 'object') {
      return val && typeof val.then === 'function';
    }
    return false;
  },
  isObject: (obj) => {
    return Object.prototype.toString.apply(obj) === '[object Object]'
  },
  isArray: (obj) => {
    return Object.prototype.toString.apply(obj) === '[object Array]'
  },
  isString: (obj) => {
    return Object.prototype.toString.apply(obj) === '[object String]'
  },
  isNumber: (obj) => {
    return Object.prototype.toString.apply(obj) === '[object Number]'
  },
}