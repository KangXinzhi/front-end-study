如何将ES6的class转换为普通的构造函数。

```
class Example{
  constructor(name){
    this.name = name;
  }
  func(){
    console.log('func')
  }
}
```

- 青铜：
```
function Example(name){
  this.name = name;
}

Example.prototype.func = (){
  console.log('func')
}
```

- 白银：
使用strict模式：由于ES6中的class本质上还是构造函数，因此在转换时要记得加上"use strict"
```
"use strict"

function Example(name){
  this.name = name;
}

Example.prototype.func = (){
  console.log('func')
}
```

- 黄金：
验证调用方式：在class中，只能通过new关键字调用构造函数，而不能直接调用。要模拟这种行为，需要通过验证this所指向的对象是否是构造函数的实例。
```
"use strict"

function Example(name){
  // 验证this指向，判断是否是new调用
  if(!this instanceof Example){
    throw new TypeError('')
  }
  this.name = name;
}

Example.prototype.func = (){
  console.log('func')
}
```

- 铂金：
保留方法成员：在class中定义的方法成员应将其放在原型上，但是方法成员是不可被枚举的。

```
"use strict"

function Example(name){
  // 验证this指向，判断是否是new调用
  if(!this instanceof Example){
    throw new TypeError('')
  }
  this.name = name;
}

Object.defineProperty(Example.prototype,'func',{
  value: function (){
    console.log('func')
  },
  enumerable: false
})
```


- 钻石：
防止原型上定义的方法使用new调用：在class类中这些方法本身不能使用new调用，需要通过验证this指向是否正确来进行判断。

```
"use strict"

function Example(name){
  // 验证this指向，判断是否是new调用
  if(!this instanceof Example){
    throw new TypeError('')
  }
  this.name = name;
}

Object.defineProperty(Example.prototype,'func',{
  value: function (){
    // 验证this指向，判断是否是new调用
    if(!(this instanceof Example)){
      throw new TypeError('')
    }
    console.log('func')
  },
  enumerable: false
})
```