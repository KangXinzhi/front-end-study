map() 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。

map() 方法对数组的每个元素执行一次给定的函数。
它接收两个参数，分别为callback和thisArg。


- callback：为数组中每个元素的执行函数，该函数接收一至三个参数
  - item：数组正在处理的当前元素
  - index：可选，数组正在处理的当前元素的索引
  - array：可选，方法正在操作的数组
- thisArg：可选参数。是当执行回调函数callback时，用在this的值


map()方法会放毁一个由原数组每个元素执行回调函数的结果组成的新数组。

```
const _map = function (callback, thisArg) {
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
    // 使用call调用函数
    newArr[index] = callback.call(thisArg, arr[index], index, arr);
    index++;
  }

  return newArr;
};
```

