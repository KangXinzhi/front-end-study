https://juejin.cn/post/7165828047520661534

方案一：CSS 动画控制
```
button{
  animation: throttle 2s step-end forwards;
}
button:active{
  animation: none;
}
@keyframes throttle {
  from {
    pointer-events: none;
  }
  to {
    pointer-events: all;
  }
}
```

方案二：通过:active去触发transition变化，然后通过监听transition回调去动态设置按钮的禁用状态

```
// css
button{
  opacity: .99;
  transition: opacity 2s;
}
button:not(:disabled):active{
  opacity: 1;
  transition: 0s;
}

// js
// 过渡开始
document.addEventListener('transitionstart', function(ev){
  ev.target.disabled = true
})
// 过渡结束
document.addEventListener('transitionend', function(ev){
  ev.target.disabled = false
})
```



实现要点：

- 函数节流是一个非常常见的优化方式，可以有效避免函数过于频繁的执行
- CSS 的实现思路和 JS 不同，重点在于在于找到和该场景相关联的属性
- CSS 实现“节流”其实就是控制一个动画的精准控制，假设有一个动画控制按钮从禁用->可点击的变化，每次点击时让这个动画重新执行一遍，在执行的过程中，一直处于禁用状态，这样就达到了“节流”的效果
- 还可以通过 transition 的回调函数动态设置按钮禁用态
- 这种实现的好处在于禁用逻辑和业务逻辑是完全解耦的

不过，这种实现方式还是比较有局限的，仅限于点击行为，像很多时候，节流可能会用在滚动事件或者键盘事件上，像这些场景就用传统方式实现就行了。
