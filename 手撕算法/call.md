实现思路
参考call的语法规则，需要设置一个参数thisArg，也就是this的指向；
将thisArg封装为一个Object；
通过为thisArg创建一个临时方法，这样thisArg就是调用该临时方法的对象了，会将该临时方法的this隐式指向到thisArg上
执行thisArg的临时方法，并传递参数；
删除临时方法，返回方法的执行结果。

```
/**
 * 用原生JavaScript实现call
 */
Function.prototype.myCall = function(thisArg, ...arr) {

  //1.判断参数合法性/////////////////////////
  if (thisArg === null || thisArg === undefined) {
    //指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中为window)
    thisArg = window;
  } else {
    thisArg = Object(thisArg);//创建一个可包含数字/字符串/布尔值的对象，
                              //thisArg 会指向一个包含该原始值的对象。
  }

  //2.搞定this的指向/////////////////////////
  const specialMethod = Symbol("anything"); //创建一个不重复的常量
  //如果调用myCall的函数名是func，也即以func.myCall()形式调用；
  //根据上篇文章介绍，则myCall函数体内的this指向func
  thisArg[specialMethod] = this; //给thisArg对象建一个临时属性来储存this（也即func函数）
  //进一步地，根据上篇文章介绍，func作为thisArg对象的一个方法被调用，那么func中的this便
  //指向thisArg对象。由此，巧妙地完成将this隐式地指向到thisArg！
  let result = thisArg[specialMethod](...arr);

  //3.收尾
  delete thisArg[specialMethod]; //删除临时方法
  return result; //返回临时方法的执行结果
};

let obj = {
  name: "coffe1891"
};

function func() {
  console.log(this.name);
}

func.myCall(obj);//>> coffe1891
```

