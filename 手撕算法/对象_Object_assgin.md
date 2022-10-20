Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。
它接收多个参数，第一个为目标对象target，后面则为sources源对象。
然后它将会返回一个目标对象，并且传入的target目标对象也会发生变化。

```
function assign(target, ...sources) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  // 遍历sources
  for (const obj of sources) {
    if (obj === null) continue;

    // 遍历obj
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        target[key] = obj[key];
      }
    }
  }

  return target;
}
```