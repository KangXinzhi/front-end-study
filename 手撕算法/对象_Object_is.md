Object.is()方法是来判断两个值是否为同一个值。它的比较方式跟===大致相同，只有两个例外：
- NaN === NaN是为false的，但Object.is(NaN, NaN)是为true的；
- +0 === -0是为true的，但Object.is(+0, -0)是为false的
Object.is()接收两个参数，然后返回一个boolean值，标示两个参数是否相等。

```
function is(value1, value2) {
  if (value1 === value2) {
    // 此时只需要识别 +0 和 -0 的情况
    // 通过 1 / +0 = Infinity 和 1 / -0 = -Infinity 的原则来识别
    return value1 !== 0 || 1 / value1 === 1 / value2;
  }

  // 此时需要识别 NaN
  // 通过 NaN !== NaN 来识别
  return value1 !== value1 && value2 !== value2;
}
```