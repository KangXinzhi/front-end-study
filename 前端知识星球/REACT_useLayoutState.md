```
一般将useLayoutEffect称为有DOM操作的副作用hooks。作用是在DOM更新完成之后执行某个操作。执行时机：在DOM更新之后执行

与useEffect对比

相同点
1.第一个参数，接收一个函数作为参数
2.第二个参数，接收【依赖列表】，只有依赖更新时，才会执行函数
3.返回一个函数，先执行返回函数，再执行参数函数
（所以说执行过程的流程是一样的）
不同点
执行时机不同。useLayoutEffect在DOM更新之后执行；useEffect在render渲染结束后执行。执行示例代码会发现useLayoutEffect永远比useEffect先执行，这是因为DOM更新之后，渲染才结束或者渲染还会结束
```

共同点  
运用效果： useEffect 与 useLayoutEffect 两者都是用于处理副作用，这些副作用包括改变 DOM、设置订阅、操作定时器等。在函数组件内部操作副作用是不被允许的，所以需要使用这两个函数去处理。  
使用方式： useEffect 与 useLayoutEffect 两者底层的函数签名是完全一致的，都是调用的 mountEffectImpl方法，在使用上也没什么差异，基本可以直接替换。  

不同点  
使用场景： useEffect 在 React 的渲染过程中是被异步调用的，用于绝大多数场景；而 useLayoutEffect 会在所有的 DOM 变更之后同步调用，主要用于处理 DOM 操作、调整样式、避免页面闪烁等问题。也正因为是同步处理，所以需要避免在 useLayoutEffect 做计算量较大的耗时任务从而造成阻塞。  
使用效果： useEffect是按照顺序执行代码的，改变屏幕像素之后执行（先渲染，后改变DOM），当改变屏幕内容时可能会产生闪烁；useLayoutEffect是改变屏幕像素之前就执行了（会推迟页面显示的事件，先改变DOM后渲染），不会产生闪烁。useLayoutEffect总是比useEffect先执行。  
在未来的趋势上，两个 API 是会长期共存的，暂时没有删减合并的计划，需要开发者根据场景去自行选择。React 团队的建议非常实用，如果实在分不清，先用 useEffect，一般问题不大；如果页面有异常，再直接替换为 useLayoutEffect 即可。  