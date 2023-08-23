// eventBus
class eventBus{
  constructor(){
    this.events = this.events || {}
  }

  on(type, callbacks){
    if(this.events[type]){
      this.events[type].push(callbacks)
    }else{
      this.events[type] = [];
      this.events[type].push(callbacks)
    }
  }

  emit(type,...rest){
    if (this.events[type]) {
      this.events[type].map(fn => fn.apply(this, rest));
    }
  }

  off(type){
    if (type) {
      if (this.events[type]) {
        delete this.events[type];
      }
    } else {
      this.events = {};
    }
  }

  once (type, callback) {
    const self = this;
    const onceCallback = function () {
      callback.apply(self, arguments);
      self.off(type);
    };
    this.on(type, onceCallback);
  }
}

//缺点：（1）包含引用类型值的原型属性会被所有实例共享，这会导致对一个实例的修改会影响另一个实例；
//      （2）在创建子类型的实例时，不能向超类型的构造函数中传递参数。
function person(name, age) {
  this.name = name;
  this.age = age;
}
person.prototype.say = function () {
  console.log("hi,i am a person");
}
function student(qq) {
  this.qq = qq;
}
student.prototype = new person();
var student1 = new student("kxz", 18, 82007);
student1.say();//hi,i am a person
student1.name; //undefined

//jisheng
function jisheng(person, student) {
  var _prototype = Object.create(person.prototype);  // 创建对象 
  _prototype.constructor = person;// 增强对象 　　　　　　
  student.prototype = _prototype;　 // 指定对象 
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

jisheng(person, student);
var student1 = new student("kxz", 18, 82007);
student1.name; //kxz
student1.say();//"hi,i am a person

class person {
  constructor(name,age){
    this.name = name;
    this.age = age
  }
  say(){
     console.log("hi,i am a person");
  }
}

class student extends person {
  constructor(name,age,qq){
    super(name, age);
    this.qq = qq;
  }
}

var student1 = new student("kxz", 18, 82007);

function myNew(fn, ...rest){
  if (typeof fn !== "function") {
    return console.error("type error");
  }

  // 创建一个对象，并将对象的原型绑定到构造函数的原型上
  const obj = Object.create(fn.prototype);
   // 调用构造函数，并且this绑定到obj上
  const value = fn.apply(obj, rest); 

  return value instanceof Object ? value : obj;
}

//手写call
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

var obj = {
  name: "康心志"
}

function fn(a, b, c) {
  console.log(a + b + c + this.name);
}

fn.myCall(obj, "我", "的", "名字是");


//手写apply

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


var obj = {
    name: "康心志"
}

function fn(a, b, c) {
     console.log(a + b + c + this.name);
}

fn.myApply(obj, ["我", "的", "名字是"]);

//手写bind
Function.prototype.myBind=function(obj){
  obj = obj || window
  let arr = [...arguments].splice(1);
  let that = this;

  return function(){
    let arr2 = [...arr, ...arguments];
    that.apply(obj, arr2);
  }
}


var obj = {
    name: "康心志"
}

function fn(a, b, c, d) {
    console.log(a + b + c + this.name + d);
}


fn.myBind(obj, "我", "的", "名字是")("！");
// fn.bind(obj, "我", "的", "名字是")("！");

function create(obj) {
  function F() {}
  F.prototype = obj
  return new F()
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