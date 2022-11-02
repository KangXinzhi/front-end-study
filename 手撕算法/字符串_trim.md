它返回一个调用字符串两端去掉空白的新字符串。

```
function trim (){
  const str = this;

  return str.replace(/^\s*|\s*$/g,'')
}
```