_.groupBy(collection, [iteratee=_.identity])
创建一个对象，key 是 iteratee 遍历 collection(集合) 中的每个元素返回的结果。 分组值的顺序是由他们出现在 collection(集合) 中的顺序确定的。每个键对应的值负责生成 key 的元素组成的数组。iteratee 调用 1 个参数： (value)。


参数
collection (Array|Object): 一个用来迭代的集合。
[iteratee=_.identity] (Array|Function|Object|string): 这个迭代函数用来转换key。
返回
(Object): 返回一个组成聚合的对象。

例子
```
_.groupBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': [4.2], '6': [6.1, 6.3] }
 
// The `_.property` iteratee shorthand.
_.groupBy(['one', 'two', 'three'], 'length');
// => { '3': ['one', 'two'], '5': ['three'] }
```

```
// v0
function groupBy(collection, propsName){
  let result = {}
  for(let item of collection){
    const key = item[propsName]
    if(!result[key]){
      result[key] = []
    }
    result[key].push(item)
  }

  return result;
}
```

```
// v1

function groupBy(collection, generateKey){
  if(typeof generateKey ==== 'string'){
    const propName = generateKey
    generateKey = (item) => item[propName]
  }
  let result = {}
  for(let item of collection){
    const key = generateKey(item)
    if(!result[key]){
      result[key] = []
    }
    result[key].push(item)
  }

  return result;
}
```