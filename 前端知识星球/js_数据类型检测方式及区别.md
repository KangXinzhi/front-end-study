- typeof
- instanceof
- constructor
- Object.prototype.toString.call([value])

## 1.typeof
```
typeof底层原理：
按照计算机底层存储的二进制结果来进行检测的，对象都是以000...开始的。
1）typeof null  "object"   =>null的二进制存储值000；(计算机遗留的一个BUG)。
2）所有对象都是以000开始的，所以基于typeof检测的结果都是 "object"，也就是typeof无法细分是普通对象还是数组等对象；
js 在底层存储变量的时候，会在变量的机器码的低位1-3位存储其类型信息。
1) 000：对象；
2) 010：浮点数；
3) 100：字符串；
4) 110：布尔；
5) 1：整数；
```

```
typeof 'abc' 或  typeof ""  // "string"
typeof 123   // "number"
typeof NaN  // "number"
typeof true   // "boolean"
typeof undefined   // "undefined"
typeof nul   // "undefined"  暂时性死区
typeof {}   // "object"
typeof []   // "object"
typeof null   // "object"
typeof /^$/   // "object" 正则
typeof Symbol()   // "symbol'
typeof console.log // "function"
typeof function() {}  // "function"
typeof BigInt   // "function"
```

```
说明：
网上资料有的说typeof是函数是错误的。typeof() 是运算符，括号可以去掉。
```

## 2、instanceof （检测数据类型不准确的）
用它来检测，一般只应用于普通对象/数组对象/正则对象/日期对象等的具体细分的。

```
let arr = [];
console.log(arr instanceof Array); //true
console.log(arr instanceof Object); //true 绝对不能证明 xxx instanceof Object 是true就是普通对象
console.log(arr instanceof RegExp); //false `
```
```
//instanceof无法应用到原始值类型数值的检测上。
let n = 10;
let m = new Number(10);
console.log(n.toFixed(2)); //"10.00"  n是Number类的实例，只不过它是字面量方式创造出来的原始类型值而已
console.log(m.toFixed(2)); //"10.00"  m也是Number类的实例，只不过它是构造函数方式创造出来的引用类型值而已
console.log(n instanceof Number); //false
console.log(m instanceof Number); //true 
```

```
function Person() {}
Person.prototype = Array.prototype;
let p1 = new Person;
//虽然p1可以基于__proto__找到Array.prototype，但是它不具备数组的任何特征(length/索引都没有的)，所以断定这货一定不是一个数组
console.log(p1); 
console.log(p1 instanceof Array); //true
```
## 3. constructor （比instanceof还好用些，但是也不准确）
原本就是获取实例的构造函数的，基于这些特点可以充当数据类型检测。constructor是可以随意被修改的。
```
原本就是获取实例的构造函数的，基于这些特点可以充当数据类型检测。constructor是可以随意被修改的。
🌰 代码实例一：
let arr = [];
console.log(arr.constructor === Array); //true  在constructor不被修改的情况下，这样区分是数组还是普通对象
console.log(arr.constructor === Object); //false
console.log(arr.constructor === RegExp); //false
🌰 代码实例二：
function Person() {}
Person.prototype = Array.prototype;
let p1 = new Person;
console.log(p1.constructor === Array); //true 一但原型重定向，constructor也改了，所以也就不准了
🌰 代码实例三：基本类型是支持的
let n = 10;
let m = new Number(10);
console.log(n.constructor === Number); //true
console.log(m.constructor === Number); //true
```

## 4、Object.prototype.toString.call([value]) 
或者 ({}).toString.call([value])
1）专门用来检测数据类型的(很强大很暴力的一种办法，基本零瑕疵)；
2）Number/String/Boolean/Symbol/BigInt/Function/Array/RegExp/Date/Object...的原型上都有toString，除了Object.prototype.toString不是转换字符串的，其余都是，Object.prototype.toString是用来检测数据类型的；
3）返回结果 "[object 对象[Symbol.toStringTag]||对象.构造函数(不受自己更改的影响,对内置类有效)||Object]"。

```
instanceof底层原理：
1、基于 “实例 instanceof 类” 检测的时候，浏览器底层是这样处理的 “类[Symbol.hasInstance](实例)”；
2、Function.prototype[Symbol.hasInstance]=function [Symbol.hasInstance](){[native code]}；
3、Symbol.hasInstance方法执行的原理
1）根据当前实例的原型链上(__proto__)是否存在这个类的原型(prototype)
2）arr.__proto__===Array.prototype   => arr instanceof Array  : true
3）arr.__proto__.__proto__===Object.prototype => arr instanceof Object : true；
```

```
Object.prototype.toString.call() 底层原理：
通过Object.prototype.toString.call(arr)改变tostring方法的this指向，从而获得对象的内置类型。
```