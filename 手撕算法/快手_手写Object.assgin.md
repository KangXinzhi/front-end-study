Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
  
简单来说，就是Object.assign()是对象的静态方法，可以用来复制对象的可枚举属性到目标对象，利用这个特性可以实现对象属性的合并。

Object.assign(target, ...sources)
参数： target--->目标对象
      source--->源对象
      返回值：target，即目标对象

```
function myAssign(target, source){
    if(arguments.length < 2){
        return target
    }
    source = Array.prototype.slice.call(arguments, 1)
    source.forEach((obj) => {
        for( key in obj){
            if(Object.prototype.hasOwnProperty.call(obj, key)){
                target[key] = obj[key]
            }
        }
    })
    return target
}
```
