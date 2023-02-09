1. 原型链继承  
```
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
```

2. 借用构造函数实现继承
```
//缺点：（1）无法继承父类原型对象上的属性和方法   
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
var student1 = new student("kxz", 18, 82007);
student1.name; //kxz
```

3. 组合继承（伪经典继承）
```
//缺点：（1）会调用两次超类型构造函数，一次是在创建子类型原型的时候，一次是在子类型构造函数的内部

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
student.prototype = new person();
student.prototype.constructor = student;
var student1 = new student("kxz", 18, 82007);
student1.name; //kxz
student1.say();//"hi,i am a person
```

4. 原型式继承
```
//缺点：如果还有另外一个对象关联了person，anotherPerson修改数组friends的时候，也会体现在这个对象中。     
var person = {
    name: 'Gaosirs',
    friends: ['Shelby', 'Court']
}
var anotherPerson = object(person)//var anotherPerson = Object.create(person) 
console.log(anotherPerson.friends) // ['Shelby', 'Court']
```

5. 寄生式继承 (增强了原型式继承) 
```    
function createAnother(o) {
    var clone = Object.create(o) // 创建一个新对象 
    clone.sayHi = function () { // 添加方法 
        console.log('hi')
    }
    return clone // 返回这个对象 
}
var person = {
    name: 'GaoSirs'
}
var anotherPeson = createAnother(person)
anotherPeson.sayHi()
```

6. 寄生组合式继承
```
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
```

7. class继承
```
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

```