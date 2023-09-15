label是html中的一个from标签

js中的label也是有个语句，一般用于终止循环。那么什么情况下需要用到label来终止循环呢？
continue：立即退出循环后从循环的顶部继续执行。
break：立即退出循环并强制执行后面的语句。

```
var n = 10;
var m = 10;
var num = 0;
for(var i=0;i<n;i++){
    for(var j=0;j<m;j++){
        if(i===5 && j===5){
            console.log('OK!');
            break;
        }
        num++;
    }
}
console.log(num);
// OK!
// 95
```

```
var n = 10;
var m = 10;
var num = 0;
lable : for(var i=0;i<n;i++){
    for(var j=0;j<m;j++){
        if(i===5 && j===5){
            console.log('OK!');
            break lable;
        }
        num++;
    }
}
console.log(num);
// OK!
// 55
```