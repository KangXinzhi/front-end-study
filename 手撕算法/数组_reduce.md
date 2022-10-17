reduce() 方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。

它接收两个参数，分别为callback和initialValue。

- callback：它接收四个参数：
  - accumulator：累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或initialValue
  - currentValue：数组中正在处理的元素
  - index：可选，数组中正在处理的当前元素的索引。 如果提供了initialValue，则起始索引号为0，否则从索引1起始
  - array：可选，调用reduce()的数组
- initialValue：可选参数。作为第一次调用callback函数时第一个参数的值。如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用callback 将报错。


reduce会返回函数累计处理的结果。


```
const _reduce = function (callback, initialValue) {
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

  // 在没有初始值的空数组上调用callback将报错
  if (len === 0 && initialValue === undefined) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  let index = 0;
  let accumulator = initialValue;
  // 没传入初始值的时候，取数组第一个值为初始值
  if (initialValue === undefined) {
    index = 1;
    accumulator = arr[0];
  }

  // 遍历调用
  while (index < len) {
    // 更新accumulator
    accumulator = callback(accumulator, arr[index], index, arr);
    index++;
  }

  // 返回累计处理的结果
  return accumulator;
};
```

