---
theme: channing-cyan
highlight: a11y-light
---

## 介绍
ahooks 是一个基于 React Hooks 的实用工具库，提供了许多常用的 Hooks，本文中源码的版本是`ahooks3.7.5`。
`usePrevious` 是 ahooks 库中的一个 React 钩子函数，它可以用来保存某个状态在上一次渲染时的值。这在某些场景下非常有用，例如需要在状态发生变化时做出相应的操作，但是又需要知道这个状态变化前的值，这时候就可以使用 `usePrevious` 钩子函数。

具体使用方法见ahooks官网：
[usePrevious的使用方法](https://ahooks.js.org/zh-CN/hooks/use-previous#api)

本系列已收集到专栏[ahooks源码分析](https://juejin.cn/column/7208359523382231101)  
同步到[github前端学习之路](https://github.com/KangXinzhi/front-end-study)


## 使用场景
`usePrevious` 钩子函数适用于需要在状态变化后做出相应操作，并且需要访问状态变化前的值的场景。例如，在某些动画场景下，需要在状态变化后记录前一个状态值，并在下一次渲染时使用它，从而使得动画效果更加平滑。

## 返回结果和参数
### Result

| 参数          | 说明            | 类型 |
| ------------- | --------------- | ---- |
| previousState | 上次 state 的值 | `T`  |

### Params

| 参数         | 说明                       | 类型                                         | 默认值              |
| ------------ | -------------------------- | -------------------------------------------- | ------------------- |
| state        | 需要记录变化的值           | `T`                                          | -                   |
| shouldUpdate | 可选，自定义判断值是否变化 | `(a?: T, b?: T) => !Object.is(a, b)` |


## 源码学习
```
import { useRef } from 'react';

export type ShouldUpdateFunc<T> = (prev: T | undefined, next: T) => boolean;

const defaultShouldUpdate = <T>(a?: T, b?: T) => !Object.is(a, b);

function usePrevious<T>(
  state: T,
  shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate,
): T | undefined {
  const prevRef = useRef<T>();
  const curRef = useRef<T>();

  if (shouldUpdate(curRef.current, state)) {
    prevRef.current = curRef.current;
    curRef.current = state;
  }

  return prevRef.current;
}

export default usePrevious;

```
首先，我们看到这段代码中导入了 React 的 `useRef` 钩子，以及定义了两个类型：`ShouldUpdateFunc` 和 `defaultShouldUpdate`。`ShouldUpdateFunc` 是一个函数类型，它接受两个参数，分别是上一个状态值和下一个状态值，并返回一个布尔值，表示是否应该更新状态值。`defaultShouldUpdate` 是一个默认的 `ShouldUpdateFunc` 函数，它使用 `Object.is` 函数比较两个值是否相等，如果不相等，则返回 true。

接下来，我们定义了 `usePrevious` 函数。它接受两个参数：一个是状态值 `state`，另一个是可选的 `shouldUpdate` 函数。`usePrevious` 内部使用了两个 `useRef` 钩子来保存上一个状态值和当前状态值。如果 `shouldUpdate` 函数返回 true，表示应该更新状态值，则将上一个状态值设置为当前状态值，当前状态值设置为传入的 `state` 值。最后，返回上一个状态值 `prevRef.current`。

## 测试源码学习

```
import { renderHook } from '@testing-library/react';
import usePrevious, { ShouldUpdateFunc } from '../';

describe('usePrevious', () => {
  function getHook<T>(initialValue?: T, compareFunction?: ShouldUpdateFunc<T>) {
    return renderHook(({ val, cmp }) => usePrevious<T>(val as T, cmp), {
      initialProps: {
        val: initialValue || 0,
        cmp: compareFunction,
      } as { val?: T; cmp?: ShouldUpdateFunc<T> },
    });
  }

  it('should return undefined on init', () => {
    expect(getHook().result.current).toBeUndefined();
  });

  it('should update previous value only after render with different value', () => {
    const hook = getHook(0, () => true);

    expect(hook.result.current).toBeUndefined();
    hook.rerender({ val: 1 });
    expect(hook.result.current).toBe(0);

    hook.rerender({ val: 2 });
    expect(hook.result.current).toBe(1);

    hook.rerender({ val: 3 });
    expect(hook.result.current).toBe(2);

    hook.rerender({ val: 4 });
    expect(hook.result.current).toBe(3);

    hook.rerender({ val: 5 });
    expect(hook.result.current).toBe(4);
  });

  it('should work fine with `undefined` values', () => {
    const hook = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: undefined as undefined | number },
    });

    expect(hook.result.current).toBeUndefined();

    hook.rerender({ value: 1 });
    expect(hook.result.current).toBeUndefined();

    hook.rerender({ value: undefined });
    expect(hook.result.current).toBe(1);

    hook.rerender({ value: 2 });
    expect(hook.result.current).toBeUndefined();
  });

  it('should receive a predicate as a second parameter that will compare prev and current', () => {
    const obj1 = { label: 'John', value: 'john' };
    const obj2 = { label: 'Jonny', value: 'john' };
    const obj3 = { label: 'Kate', value: 'kate' };
    type Obj = { label: string; value: string };
    const predicate = (a: Obj | undefined, b: Obj) => (a ? a.value !== b.value : true);

    const hook = getHook(obj1 as Obj, predicate);

    expect(hook.result.current).toBeUndefined();

    hook.rerender({ val: obj2, cmp: predicate });

    expect(hook.result.current).toBeUndefined();

    hook.rerender({ val: obj3, cmp: predicate });

    expect(hook.result.current).toBe(obj1);
  });
});
```

-   `getHook`：创建一个 renderHook 的工具函数，用来传递参数和获取 Hook 的结果；
-   `should return undefined on init`：测试初始化时返回 undefined；
-   `should update previous value only after render with different value`：测试只在有新值时更新旧值；
-   `should work fine with  `undefined`  values `：测试处理 undefined 的情况；
-   `should receive a predicate as a second parameter that will compare prev and current`：测试第二个参数是用来比较旧值和新值的回调函数。
### pr贡献
提交了一个测试用例：只在无新值时不更新旧值  
修改了下文档  
[pr查看](https://github.com/alibaba/hooks/pull/2122)
