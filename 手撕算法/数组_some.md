some() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。

它接收两个参数，分别为callback和thisArg。


- callback：为数组中每个元素的执行函数，该函数接收一至三个参数
  - item：数组正在处理的当前元素
  - index：可选，数组正在处理的当前元素的索引
  - array：可选，方法正在操作的数组
- thisArg：可选参数。是当执行回调函数callback时，用在this的值

注意：如果用一个空数组进行测试，在任何情况下它返回的都是false。



```
const _some = function (callback, thisArg) {
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

  // 遍历数组
  while (index < len) {
    if (callback.call(thisArg, arr[index], index, arr)) {
      return true;
    }
  }

  return false;
};
```

