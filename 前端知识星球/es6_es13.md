### es6
- 声明 let/const
- 解构赋值
- 字符串扩展：字符串模板/repeat/matchAll/includes/startsWith/endsWith
- 数值扩展：isNaN/parseInt/parseFloat
- 对象扩展：
  - Object.is()
  - Object.assign()
  - Object.getPrototypeOf()
  - Object.setPrototypeOf()
  - `__proto__`
  - super
  - for-in
  - Object.keys()
- 数组扩展
  - 扩展运算符(...)：转换数组为用逗号分隔的参数序列([...arr]，相当于rest/spread参数的逆运算)
  - Array.from()：转换具有Iterator接口的数据结构为真正数组，返回新数组
  - Array.of()：转换一组值为真正数组，返回新数组
  - copyWithin()：把指定位置的成员复制到其他位置，返回原数组
  - find()：返回第一个符合条件的成员
  - findIndex()：返回第一个符合条件的成员索引值
  - fill()：根据指定值填充整个数组，返回原数组
  - keys()：返回以索引值为遍历器的对象
  - values()：返回以属性值为遍历器的对象
  - entries()：返回以索引值和属性值为遍历器的对象
  - 数组空位：ES6明确将数组空位转为undefined(空位处理规不一，建议避免出现)
- 函数扩展
  - 箭头函数
  - rest/spread参数(...)：返回函数多余参数
  - 参数默认值
- 正则扩展
- Symbol
- Set
- WeakSet
- Map
- WeakMap
- Proxy
- Reflect
- Class
- Module
- Iterator
- Promise
- Generator



### es7
- 数组includes
- 数值 指数运算符 **

### es8
- 字符串padStart/padEnd  
- 对象Object.values  
- 对象Object.entries  
- 函数参数尾逗号
- async/await


### es9
- 对象扩展运算符(...)
- 正则扩展前置断言/后置断言
- 正则扩展具名组匹配：为每组匹配指定名字(`?<GroupName>`)
- Promise finally

### es10
- 字符串trimStart/trimEnd
- 对象Object.formEntries()
- 数组flat/flatMap

### es11
- BigInt -> n
- 对象扩展可选链?.
- 对象扩展空值??
- globalThis
- Promise.allSettled

### es12
- 逻辑运算符||=
- 逻辑运算符??=
- 逻辑运算符&&=
- 对象若引用WeakRef（会被GC回收）
- FinalizationRegistry：在对象被垃圾回收时请求一个回调
- Promise.any

### es13
 - 数组at 支持倒序查找
 - 支持在最外层写await
 - 给类定义私有方法和成员变量，hashtag(#)前缀
 - 类成员声明
 - 正则支持返回开始和结束索引，添加一个d的标记来实现

### es14
- 从尾到头搜索数组：findLast() 、findLastIndex()
- Hashbang 语法
- 通过副本更改数组：toReversed()、toSorted()、toSpliced()、with()
- Symbol 作为 WeakMap 的键