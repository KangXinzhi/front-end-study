_.chunk(array, [size=1])

将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。 如果array 无法被分割成全部等长的区块，那么最后剩余的元素将组成一个区块。

参数
array (Array): 需要处理的数组
[size=1] (number): 每个数组区块的长度

返回
(Array): 返回一个包含拆分区块的新数组（注：相当于一个二维数组）。

例子
```
_.chunk(['a', 'b', 'c', 'd'], 2);
// => [['a', 'b'], ['c', 'd']]
 
_.chunk(['a', 'b', 'c', 'd'], 3);
// => [['a', 'b', 'c'], ['d']]
```

```
function chunk(array,size=1){
  if(size<1){
    return [];
  }
  let result = [];

  for(let i = 0;i<array.length;i+=size){
    result.push(array.slice(i,i+size))
  }

  return result;
}


```