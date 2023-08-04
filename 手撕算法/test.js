// 寄生组合继承
function jisheng(person, student) {
  var _prototype = Object.create(person.prototype);  // 创建对象 
  _prototype.constructor = person;// 增强对象 　　　　　　
  student.prototype = _prototype;　 // 指定对象 
}

function person (name,age){
  this.name= name;
  this.age = age;
}

function student(name,age,sex){
  person.call(this,name,age)
  this.sex = sex;
}
jisheng(person,student)


// class继承
class person{
  constructor(name,age){
    this.name = name;
    this.age = age;
  }
}

class student extends person {
  constructor(name,age,sex){
    super(name,age)
    this.sex = sex
  }
}

// new
function myNew(fn, ...args){
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

//call
Function.prototype.myCall=function(obj){
  let arr = [...arguments].splice(1);
  let params = Symbol('params')
  let result;
  obj[params] = this;
  result = obj[params](...arr)

  delete obj.params
  return result;
}

//apply
Function.prototype.myApply=function(obj,arr){
  let params = Symbol('params')
  let result;
  obj[params] = this;
  result = obj[params](...arr)

  delete obj.params
  return result;
}

//bind 
Function.prototype.myBind=function(obj){
  obj = obj || window
  let arr = [...arguments].splice(1);
  let that = this;

  return function(){
    let arr2 = [...arr, ...arguments];
    that.apply(obj, newArray2);
  }
}

//create 
function create(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}


// debounce
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

// throttle
function throttle(fn, time) {
  let timer = +new Date()  // 声明初始时间
  return function(...arg){
    let newTimer = +new Date()  // 获取触发事件的时间
    if(timer - newTimer>time){
      fn.apply(this,arg)
      timer =  +new Date()
    }
  }
}

// instanceof
function _instanceof(instance, classOrFunc){
  if(typeof instance !== 'object' || instance == null) return false;
  let proto = Object.getPrototypeOf(instance); // 等价于 instance.__ptoto__
  while(proto){
    if(proto == classOrFunc.prototype) return true;
    proto = Object.getPrototypeof(proto); 
  }
  return false
}

// deepClone
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
      return obj;
  }

  if (!deepClone.cacheMap) {
      deepClone.cacheMap = new Map();
  }

  //  判断缓存
  if (deepClone.cacheMap.has(obj)) {
      return deepClone.cacheMap.get(obj);
  }

  if (obj instanceof Map) {
      let tmp = new Map();
      deepClone.cacheMap.set(obj, tmp);
      obj.forEach((value, key) => {
          tmp.set(key, deepClone(value));
      })
      return tmp;
  } else if (obj instanceof Set) {
      let tmp = new Set();
      deepClone.cacheMap.set(obj, tmp);
      obj.forEach((value) => {
          tmp.add(value)
      })
      return tmp
  } else if (obj instanceof RegExp) {
      let tmp = new RegExp(obj);
      deepClone.cacheMap.set(obj, tmp);
      return tmp;
  } else if (obj instanceof Date) {
      let tmp = new Date(obj);
      deepClone.cacheMap.set(obj, tmp);
      return tmp;
  } else {
      let tmp = obj.constructor === Array ? [] : {};

      deepClone.cacheMap.set(obj, tmp);

      for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
              tmp[key] = deepClone(obj[key]);
          }
      }
      return tmp;
  }
}

// deepClone 

function deepClone(obj){
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  let tmp = obj.constructor === Array ? [] : {};
  
  for(let [key,value] of Object.entries(tmp)){
    tmp[key] = typeof value ==='object'? deepClone(value):value
  }
  
  return tmp
}


// promise
function Promise(executor){
  function resolve(){}

  function reject(){}

  executor(resolve,reject)
}

Promise.prototype.then=function(){}
Promise.prototype.resolve=function(){}
Promise.prototype.reject=function(){}
Promise.prototype.catch = function(){}
Promise.prototype.finally = function(){}
Promise.prototype.all=function(){}
Promise.prototype.race=function(){}
Promise.prototype.any=function(){}
Promise.prototype.allsettled=function(){}


//1.
function Promise(executor){
  this.promiseState = "pending";
  this.promiseResult = null;
  this.callbacks = [];
  const self = this;
  function resolve(){
    if (self.promiseState !== "pending") return;
    self.promiseState = "fulfilled";
    self.promiseResult = data;
    setTimeout(() => {
      self.callbacks.forEach((item) => {
        item.onResolved(data);
      });
    });
  }

  function reject(){
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


//2
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

// promise all
Promise.prototype.all = function(arr){
  let result = []
  return new Promise((resolve,reject)=>{
    for(let i=0;i<arr.length;i++){
      arr[i].then((v)=>{
        result[i] = v
        if(result.length===arr.length){
          resolve(result)
        }
      },(rej)=>{
        reject(rej)
      })
    }
  })
}

// Promise 并行请求
// 实现一个批量请求函数 multiRequest(apis, maxNum)，要求如下：
// ● 要求最大并发数 maxNum
// ● 每当有一个请求返回，就留下一个空位，可以增加新的请求
// ● 所有请求完成后，结果按照 apis 里面的顺序依次打出

function multiRequest(apis, maxNum){
  let index = 0;
  let count = 0; 
  let result = [];

  for(let i=0;i<maxNum;i++){
    request();
  }

  async function request(){
    if (index === apis.length) return;
    let i = index;
    let api = apis[i];
    index++;
    
    try{
      const res = await fetch(api);
      result[i] = res
    }catch(e){
      result[i] = e
    }finally{
      count++;
      if(count===apis.length){
        return result;
      }
      request()
    }
  }
}

// 数组转树
// let arr = [
//     {id: 1, name: '部门1', pid: 0},
//     {id: 2, name: '部门2', pid: 1},
//     {id: 3, name: '部门3', pid: 1},
//     {id: 4, name: '部门4', pid: 3},
//     {id: 5, name: '部门5', pid: 4},
// ]


// 需要转成的数据结构  
// [
//     {
//         "id": 1,
//         "name": "部门1",
//         "pid": 0,
//         "children": [
//             {
//                 "id": 2,
//                 "name": "部门2",
//                 "pid": 1,
//                 "children": []
//             },
//             {
//                 "id": 3,
//                 "name": "部门3",
//                 "pid": 1,
//                 "children": [
//                     // 结果 ,,,
//                 ]
//             }
//         ]
//     }
// ]

function arr2Tree(arr,pid){
  return arr.filter(item=>item.id===pid).map((i)=>({...i,children:arr2Tree(arr,i.id)}))
}

//单例模式
class Storage{
  static getInstance() {
    if(!Storage.instance) {
        Storage.instance = new Storage()
    }
    return  Storage.instance
  }
  getItem(key) {
    return localStorage.getItem(key);
  }
  setItem(key, value){
      return localStorage.setItem(key, value);
  }
}

// quickSort

function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) {
    return;
  }

  const pivot = partition(arr, left, right);
  quickSort(arr, left, pivot - 1);
  quickSort(arr, pivot + 1, right);
  return arr;
}

function partition(arr,left,right){
  let i = left;
  let pivot = arr[left];

  for(let j = left; j<=right; j++){
    if(pivot>arr[j]){
      i++;
      swap(arr,i,j) 
    }
  }
  swap(arr,left,i)

  return i;
}

function swap(arr,i,j){
  let temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}


// 订阅发布 on emit off

class eventBus{
  constructor(){
    events = {}
  }

  on(type,fn){
    if(!this.event[type]){
      events[type] = [fn]
    }else{
      events[type].push(fn)
    }
  }

  emit(type){
    if(!event)
  }
}
