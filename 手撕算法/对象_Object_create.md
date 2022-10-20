Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
它接收两个参数：
- proto：新创建对象的原型对象，只能是对象或null，否则会报错；
- propertiesObject：可选，需要传入一个对象，该对象的属性类型参照Object.defineProperties()的第二个参数。如果传入null会报错。
然后该函数会返回一个新对象，带着指定原型对象和属性。
```
function create(proto, propertiesObject=undefined) {
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null.');
  }

  if (propertiesObject === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  function F() {}
  F.prototype = proto;  // 绑定原型
  const obj = new F();   // 新建实例对象

  // 自定义属性
  if (propertiesObject !== undefined) {
    Object.defineProperties(obj, propertiesObject);
  }

  if (proto === null) {
    obj.__proto__ = null;  // 如果proto为null，将清空原型
  }
  return obj;
}
```