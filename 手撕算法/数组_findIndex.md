findIndex() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。

它接收两个参数，分别为callback和thisArg。


- callback：为数组中每个元素的执行函数，该函数接收一至三个参数
  - item：数组正在处理的当前元素
  - index：可选，数组正在处理的当前元素的索引
  - array：可选，方法正在操作的数组
- thisArg：可选参数。是当执行回调函数callback时，用在this的值


```
const _findIndex = function (callback, thisArg) {
  // 判断this不等于null
  if (this === null) {
    throw new TypeError('this is null or not defined');
  }

  // 判断callback是不是一个函数
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  const arr = this;
  const len = arr.length;

  let index = 0;
  let newArr = [];

  // 遍历数组
  while (index < len) {
    // 如果通过回调函数的测试，则添加到newArr
    if (callback.call(thisArg, arr[index], index, arr)) {
      return index;
    }
    index++;
  }

  // 如果没有一个满足条件的话则返回 -1
  return -1;
};
```

