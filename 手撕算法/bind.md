实现思路
（1）拷贝调用函数:
调用函数，也即调用myBind的函数，用一个变量临时储存它；
使用Object.create复制调用函数的prototype给funcForBind；
（2）返回拷贝的函数funcForBind；
（3）调用拷贝的函数funcForBind：
new调用判断：通过instanceof判断函数是否通过new调用，来决定绑定的context；
通过call绑定this、传递参数；
返回调用函数的执行结果。
```
/**
 * 用原生JavaScript实现bind
 */
Function.prototype.myBind = function(objThis, ...params) {
  const thisFn = this;//存储调用函数，以及上方的params(函数参数)
  //对返回的函数 secondParams 二次传参
  let funcForBind = function(...secondParams) {
    //检查this是否是funcForBind的实例？也就是检查funcForBind是否通过new调用
    const isNew = this instanceof funcForBind;

    //new调用就绑定到this上,否则就绑定到传入的objThis上
    const thisArg = isNew ? this : Object(objThis);

    //用call执行调用函数，绑定this的指向，并传递参数。返回执行结果
    return thisFn.call(thisArg, ...params, ...secondParams);
  };

  //复制调用函数的prototype给funcForBind
  funcForBind.prototype = Object.create(thisFn.prototype);
  return funcForBind;//返回拷贝的函数
};
```

