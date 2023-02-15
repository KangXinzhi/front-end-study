https://mp.weixin.qq.com/s/u5Xd_UOoN7ySkMPlpuK3Kg

## Promise 的常用方法

- Promise.prototype.then 方法: (onResolved, onRejected) => {} (1) onResolved 函数: 成功的回调函数 (value) => {} (2) onRejected 函数: 失败的回调函数 (reason) => {} 说明: 指定用于得到成功 value 的成功回调和用于得到失败 reason 的失败回调 返回一个新的 promise 对象
- Promise.prototype.catch 方法: (onRejected) => {} (1) onRejected 函数: 失败的回调函数 (reason) => {} 说明: then()的语法糖, 相当于: then(undefined, onRejected)
- Promise.resolve 方法: (value) => {} (1) value: 成功的数据或 promise 对象 说明: 返回一个成功/失败的 promise 对象
- Promise.reject 方法: (reason) => {} (1) reason: 失败的原因 说明: 返回一个失败的 promise 对象
- Promise.all 方法: (promises) => {} (1) promises: 包含 n 个 promise 的数组 说明: 返回一个新的 promise, 接收一个 Promise 对象的集合，只有所有的 promise 都成功才成功, 只要有一个失败了就 直接失败
- Promise.race 方法: (promises) => {} (1) promises: 包含 n 个 promise 的数组 说明: 返回一个新的 promise, 接收一个 Promise 对象的集合，第一个完成的 promise 的结果状态就是最终的结果状态
- Promise.any 方法: (promises) => {} (1) promises: 包含 n 个 promise 的数组 说明: 返回一个新的 promise, 接收一个 Promise 对象的集合，当其中的一个 promise 成功，就返回那个成功的 promise 的值，如果可迭代对象中没有一个 promise 成功（即所有的 promises 都失败/拒绝），就返回一个失败的 promise 和 AggregateError 类型的实例。
- Promise.allSettled 方法: (promises) => {} (1) promises: 包含 n 个 promise 的数组 说明：方法返回一个在所有给定的 promise 都已经 fulfilled 或 rejected 后的 promise，并带有一个对象数组，每个对象表示对应的 promise 结果。当您有多个彼此不依赖的异步任务成功完成时，或者您总是想知道每个 promise 的结果时，通常使用它。该方法为 ES2020 新增的特性，它能够返回所有任务的结果。

## 封装 Promise

### 整体结构

```
// 构造函数

function Promise(executor){

  function resolve(){}

  function reject(){}

  executor(resolve,reject)
}

Promise.prototype.then = function(){}
Promise.prototype.catch = function(){}
Promise.prototype.finally = function(){}

Promise.resolve=function(){}
Promise.reject=function(){}

Promise.race=function(){}
Promise.all=function(){}

Promise.finally=function(){}
Promise.allSettled=function(){}
Promise.any=function(){}

```

### Promise 构造函数

```
function Promise(executor) {
  this.promiseState = "pending";
  this.promiseResult = null;
  this.callbacks = [];
  const self = this;

  function resolve(data) {
    if (self.promiseState !== "pending") return;
    self.promiseState = "fulfilled";
    self.promiseResult = data;
    setTimeout(() => {
      self.callbacks.forEach((item) => {
        item.onResolved(data);
      });
    });
  }

  function reject(data) {
    if (self.promiseState !== "pending") return;
    self.promiseState = "rejected";
    self.promiseResult = data;
    setTimeout(() => {
      self.callbacks.forEach((item) => {
        item.onRejected(data);
      });
    });
  }

  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
```

改变 Promise 状态的三种方式：

- resolve()
- reject()
- throw() 通过 try...catch...实现
  上面的代码中兼容了对上面三种方法的处理，Promise 状态只能修改一次且不可逆，如果调用了 resolve()，然后再调用 reject()，只会执行前者，后者不执行；那么如何实现状态的不可逆修改呢？通过判断状态 if(self.promiseState !== 'pending') return; 即保证每次都是从 pending 修改状态到失败或者成功。

### Promise then

```
Promise.prototype.then = function (onResolved, onRejected) {
  const self = this;

  if (typeof onRejected !== "function") {
    onRejected = (reason) => {
      throw reason;
    };
  }

  if (typeof onResolved !== "function") {
    onResolved = (value) => value;
  }

  return new Promise((resolve, reject) => {
    if (this.promiseState === 'fulfilled'){
      setTimeout(() => {
        callback(onResolved);
      });
    }

    if (this.promiseState === 'rejected'){
      setTimeout(() => {
        callback(onRejected);
      });
    }

    if (this.promiseState === 'pending'){
      this.callbacks.push({
        onResolved: function () {
          callback(onResolved);
        },
        onRejected: function () {
          callback(onRejected);
        },
      });
    }

    function callback(type){
      try {
        const result = type(self.promiseResult);
        if (result instanceof Promise) {
          result.then(
            (v) => {
              resolve(v);
            },
            (r) => {
              reject(r);
            }
          );
        } else {
          resolve(result);
        }
      } catch (e) {
        reject(e);
      }
    }
  })
}

```

### Promise catch

```
Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};
```

### Promise resolve

```
// resolve方法 作用： 快速创建promise对象
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      value.then(
        (v) => {
          resolve(v);
        },
        (r) => {
          reject(r);
        }
      );
    } else {
      resolve(value);
    }
  });
};
```

### Promise race

race 方法无论成功失败，只要最先返回的结果，只要有结果就返回：

```
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for(let i = 0;i<promises.length;i++){
      promises[i].then(
        (v)=>{
          resolve(v)
        },
        (r)=>{
          reject(r);
        }
      )
    }
  });
};
```

### Promise all

all 方法的实现：其中一个 Promise 成功的时候不可以改变状态，只有全部成功才能改变状态；实现是使用一个计数器，当数量和 promises 数量相同，且都成功了，就返回所有结果，失败直接改变状态结

```
Promise.all = function (promises) {
  let count = 0;
  let arr = [];
  return new Promise((resolve, reject) => {
    for(let i=0;i<promises.length;i++){
      promise[i].then((v)=>{
        count++;
        arr[i]=v;
        if(count===promises.length){
          resolve(arr)
        }
      },
      (r)=>{
        reject(r)
      }
      )
    }
  });
};
```

### Promise finally

es9 新增方法

```
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

### Promise allSettled

es11 新增方法

```
Promise.allSettled = function (promises) {
  let count = 0;
  let arr=[]
  return new Promise((resolve, reject) => {
    for(let i = 0;i<promises.length;i++){
      promises[i].then(
        (v)=>{
          count++;
          arr[i] = { status: "fulfilled", value: v };
          if(count===promise.length){
            resolve(arr)
          }
        },
        (r)=>{
          count++;
          arr[i] = { status: "rejected", reason: r };
          if(count===promise.length){
            resolve(arr)
          }
        }
      )
    }
  });
};
```

### Promise any

es12 新增方法
any 方法实现：其中的一个 promise 成功，就返回那个成功的 promise 的值，失败返回一个 AggregateError 类型的错误 new AggregateError('AggregateError: All promises were rejected')

```
Promise.any = function (promises) {
  let count = 0;
  return new Promise((resolve, reject) => {
    for(let i = 0;i<promises.length;i++){
      promises[i].then(
        (v)=>{
          resolve(v)
        },
        (r)=>{
          count++;
          if(count===promise.length){
            reject(new AggregateError("AggregateError: All promises were rejected"))
          }
        }
      )
    }
  });
};
```
