// class 继承
class person{
  constructor(name,age){
    this.name = name
    this.age= age
  }
  hello(){
    console.log(`hello my name is ${this.name}`)
  }
}

class Student extends person{
  constructor(name,age,id){
    super(name,age)
    this.id = id
  }
}

// 寄生组合继承
function jisheng(person,student){
  let _prototype = Object.create(person.prototype)
  _prototype.constructor = person
  student.prototype = _prototype
}

function person(name, age) {
  this.name = name;
  this.age = age;
}
person.prototype.say = function () {
  console.log("hi,i am a person");
}
function student(name, age, qq) {
  person.call(this, name, age)
  this.qq = qq;
}

// new
function myNew(fn, ...args) {
  // 判断参数是否是一个函数
  if (typeof fn !== "function") {
    return console.error("type error");
  }

  // 创建一个对象，并将对象的原型绑定到构造函数的原型上
  const obj = Object.create(fn.prototype);

  // 调用构造函数，并且this绑定到obj上
  const value = fn.apply(obj, args); 

  // 如果构造函数有返回值，并且返回的是对象，就返回value ;否则返回obj
  return value instanceof Object ? value : obj;
}

Function.prototype.myCall=function(obj){
  obj = obj || window;
  let arr = [...arguments].splice(1);
  let params = Symbol('params')
  let result;
  obj[params] = this;
  result = obj[params](...arr)

  delete obj.params
  return result;
}


Function.prototype.myApply=function(obj,arr){
  obj = obj || window;
  let params = Symbol('params')
  let result;
  obj[params] = this;
 
  if(arr){
   result = obj[params](...arr)
  }else{
   result = obj[params](arr)
  }
  delete obj.params
  return result;
}

//手写bind
Function.prototype.myBind=function(obj){
  obj = obj || window
  let arr = [...arguments].splice(1);
  let that = this;

  return function(){
    let arr2 = [...arr, ...arguments];
    that.apply(obj,arr2);
  }
}

// create
function create(obj) {
  function f(){}
  f.prototype = obj
  return new f()
}

// 防抖
function debounce(fn, time) {
  let timer  //声明接收定时器的变量
  return function (...arg) {  // 获取参数
    timer && clearTimeout(timer)  // 清空定时器
    timer = setTimeout(() => {  //  生成新的定时器
      //因为箭头函数里的this指向上层作用域的this,所以这里可以直接用this，不需要声明其他的变量来接收
      fn.apply(this, arg) // fn()
    }, time)
  }
}

// 节流
function throttle(fn, time) {
  let timer = +new Date()  // 声明初始时间
  return function (...arg) { // 获取参数
    let newTimer = +new Date()  // 获取触发事件的时间
    if (newTimer - timer >= time) {  // 时间判断,是否满足条件
      fn.apply(this, arg)  // 调用需要执行的函数,修改this值,并且传入参数
      timer = +new Date() // 重置初始时间
    }
  }
}

// 实例.__ptoto__ === 构造函数.prototype
function _instanceof(instance, classOrFunc) {
  // 由于instance要检测的是某对象，需要有一个前置判断条件
  //基本数据类型直接返回false
  if(typeof instance !== 'object' || instance == null) return false;

  let proto = Object.getPrototypeOf(instance); // 等价于 instance.__ptoto__
  while(proto) { // 当proto == null时，说明已经找到了Object的基类null 退出循环
      // 实例的原型等于当前构造函数的原型
      if(proto == classOrFunc.prototype) return true;
      // 沿着原型链__ptoto__一层一层向上查
      proto = Object.getPrototypeof(proto); // 等价于 proto.__ptoto__
  }

  return false
}

// deepcopy
function deepCopy(obj){
  let newObj=obj instanceof Array?[]:{};

  for(const [k,v] of Object.entries(obj)){
    newObj[k] = typeof v =="object" ? deepCopy(v):v;
  }

  return newObj;
}


// deepcopy2

const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
      return obj;
  }
  if (obj instanceof Map) {
      let tmp = new Map();
      obj.forEach((value, key) => {
          tmp.set(key, deepClone(value));
      })
      return tmp;
  } else if (obj instanceof Set) {
      let tmp = new Set();
      obj.forEach((value) => {
          tmp.add(value)
      })
      return tmp
  } else if (obj instanceof RegExp) {
      let tmp = new RegExp(obj);
      return tmp;
  } else if (obj instanceof Date) {
      let tmp = new Date(obj);
      return tmp;
  } else {
      let tmp = obj.constructor === Array ? [] : {};

      for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
              tmp[key] = deepClone(obj[key]);
          }
      }
      return tmp;
  }
}

//promise

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