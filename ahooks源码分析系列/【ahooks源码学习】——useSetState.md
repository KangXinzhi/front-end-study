---
theme: channing-cyan
highlight: a11y-light
---

## 介绍

ahooks 是一个基于 React Hooks 的实用工具库，提供了许多常用的 Hooks，本文中源码的版本是`ahooks3.7.5`。

`useSetState`是一个自定义 Hook，它可以帮助我们更好地管理组件状态。与 React 的`useState` Hook 不同，`useSetState`允许我们更新部分状态，而不是整个状态对象。这使得我们可以更加灵活地管理组件状态，同时也可以提高性能。用法与 class 组件的  `this.setState`  基本一致。

[useSetState 基础用法](https://ahooks.js.org/zh-CN/hooks/use-set-state#%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95)

本系列已收集到专栏[ahooks 源码分析](https://juejin.cn/column/7208359523382231101) 同步到[github 前端学习之路](https://github.com/KangXinzhi/front-end-study)

## 使用场景

`useSetState`适用于以下场景：

- 需要在组件中管理一些复杂的状态，而这些状态不方便使用单独的`useState`来管理。
- 需要在组件中管理的状态对象比较大，但是每次更新时只需要修改其中的一小部分属性。
- 需要在组件中管理的状态对象需要被多个子组件使用，并且这些子组件需要更新其中的一部分属性。

在这些场景下，`useSetState`可以帮助我们更好地管理状态，避免了使用多个`useState` Hook 或手动管理状态的麻烦。

## 源码分析

下面是`useSetState`的源码：

```
import { useCallback, useState } from 'react';
import { isFunction } from '../utils';

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null),
) => void;

const useSetState = <S extends Record<string, any>>(
  initialState: S | (() => S),
): [S, SetState<S>] => {
  const [state, setState] = useState<S>(initialState);

  const setMergeState = useCallback((patch) => {
    setState((prevState) => {
      const newState = isFunction(patch) ? patch(prevState) : patch;
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  return [state, setMergeState];
};

export default useSetState;
```

`useSetState`的实现基于`useState`和`useCallback` Hook。它接受一个初始状态对象或一个返回初始状态对象的函数作为参数，并返回一个元素为两个值的数组。第一个值是当前状态对象，第二个值是更新状态的函数。

更新状态的函数被命名为`setMergeState`，它使用`useCallback` Hook 来避免在每次渲染时创建新的函数。它接受一个`patch`参数，可以是一个包含部分状态的对象或一个返回部分状态的函数。它使用`isFunction`函数来判断`patch`参数是否为一个函数，如果是则将它执行，否则直接使用它。

在`setState`函数中，使用`prevState`来获取当前状态，并将`patch`参数应用于它。如果`patch`返回了一个新的状态对象，则将它与旧的状态对象合并，并返回新的状态对象。如果`patch`返回了`null`或`undefined`，则返回旧的状态对象，表示没有更新任何状态。

在这个过程中，`useState`和`useCallback` Hooks 会确保我们的状态和更新函数在组件渲染时正确地保持不变，并且在每次更新时只更新需要更新的部分状态，以提高性能。

## 测试源码分析

```
import { act, renderHook } from '@testing-library/react';
import useSetState from '../index';

describe('useSetState', () => {
  const setUp = <T extends object>(initialValue: T) =>
    renderHook(() => {
      const [state, setState] = useSetState<T>(initialValue);
      return {
        state,
        setState,
      } as const;
    });

  it('should support initialValue', () => {
    const hook = setUp({
      hello: 'world',
    });
    expect(hook.result.current.state).toEqual({ hello: 'world' });
  });

  it('should support object', () => {
    const hook = setUp<any>({
      hello: 'world',
    });
    act(() => {
      hook.result.current.setState({ foo: 'bar' });
    });
    expect(hook.result.current.state).toEqual({ hello: 'world', foo: 'bar' });
  });

  it('should support function update', () => {
    const hook = setUp({
      count: 0,
    });
    act(() => {
      hook.result.current.setState((prev) => ({ count: prev.count + 1 }));
    });
    expect(hook.result.current.state).toEqual({ count: 1 });
  });
});

```

这个测试文件包含了三个测试方法，分别对应钩子 `useSetState` 的三个主要功能：初始化值、对象更新和函数更新。

第一个测试用例`should support initialValue` 测试钩子是否支持初始化值。使用 `setUp` 函数初始化一个带有 `hello: 'world'` 属性的对象，然后断言钩子返回的当前状态是否与初始化值相等。

第二个测试用例`should support object` 测试钩子是否支持对象更新。使用 `setUp` 函数初始化一个空对象，然后使用 `act` 函数来调用钩子返回的更新状态函数，将 `{ foo: 'bar' }` 对象作为参数传入。最后，断言钩子返回的当前状态是否与更新后的对象相等。

第三个测试用例`should support function update` 测试钩子是否支持函数更新。使用 `setUp` 函数初始化一个包含 `count: 0` 属性的对象，然后使用 `act` 函数来调用钩子返回的更新状态函数，将一个函数作为参数传入，该函数将前一个状态作为参数，返回一个新的状态，这里将 `count` 属性加一。最后，断言钩子返回的当前状态是否与更新后的对象 `{ count: 1 }` 相等。
