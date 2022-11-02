slice()方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。
该方法接收两个参数：


beginIndex：从该索引（以 0 为基数）处开始提取原字符串中的字符。如果值为负数，会被当做 strLength + beginIndex 看待，这里的strLength 是字符串的长度


endIndex：可选。在该索引（以 0 为基数）处结束提取字符串。如果省略该参数，slice() 会一直提取到字符串末尾。如果该参数为负数，则被看作是 strLength + endIndex，这里的 strLength 就是字符串的长度


它返回一个从原字符串中提取出来的新字符串。

```
function slice(beginIndex, endIndex) {
  const str = this;
  // 处理 beginIndex 小于零情况
  beginIndex = beginIndex < 0 ? str.length + beginIndex : beginIndex;
  // 处理 endIndex 为没有传的情况
  endIndex =
    endIndex === undefined
      ? str.length
      : endIndex < 0 /* 判断 endIndex 是不是小于0 */
      ? str.length + endIndex
      : endIndex;

  // 当 beginIndex 大于等于 endIndex 时，则返回空字符串
  if (beginIndex >= endIndex) return '';

  let result = '';
  // 遍历拼接结果
  for (let i = beginIndex; i < endIndex; i++) {
    result += str[i];
  }

  return result;
}
```