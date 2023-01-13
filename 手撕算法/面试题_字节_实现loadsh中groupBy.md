```
groupBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': [4.2], '6': [6.1, 6.3] }
 
// The `_.property` iteratee shorthand.
groupBy(['one', 'two', 'three'], 'length');
// => { '3': ['one', 'two'], '5': ['three'] }

```

```
function groupBy(arr,props){
  return arr.reduce((pre,item)=>{
    let isFunction = typeof(props) === 'function'
    let key = isFunction ? props(item) : item[props]
    return {
      ...pre,
      [key]: [...pre[key]||[],item]
    }
  },{})
}
```