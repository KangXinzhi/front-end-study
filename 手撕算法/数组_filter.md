filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

它接收两个参数，分别为callback和thisArg。


- callback：为数组中每个元素的执行函数，该函数接收一至三个参数
  - item：数组正在处理的当前元素
  - index：可选，数组正在处理的当前元素的索引
  - array：可选，方法正在操作的数组
- thisArg：可选参数。是当执行回调函数callback时，用在this的值


filter()会返回一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。

```
const _filter = function (callback, thisArg) {
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
      newArr.push(arr[index]);
    }
    index++;
  }

  return newArr;
};
```

