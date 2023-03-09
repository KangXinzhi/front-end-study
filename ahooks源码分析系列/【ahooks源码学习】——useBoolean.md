## 介绍

ahooks 是一个基于 React Hooks 的实用工具库，提供了许多常用的 Hooks，本文中源码的版本是`ahooks3.7.5`。
`useBoolean` 可以帮助我们管理布尔类型的状态，它可以帮助我们简化状态管理的代码，提高开发效率。

## 使用场景

`useBoolean` 的使用场景非常广泛，以下是一些常见的场景：

1.  控制开关状态：用 `useBoolean` 来管理某个开关的状态，例如弹窗、抽屉、菜单等的显示或隐藏状态。
2.  处理复杂逻辑：用 `useBoolean` 来简化某些复杂的状态逻辑处理，例如异步加载数据时的 loading 状态。
3.  处理多选状态：用 `useBoolean` 来管理多个选项的选中状态，例如多选框组件。

## 源码学习

```
import { useMemo } from 'react';
import useToggle from '../useToggle';

export interface Actions {
  setTrue: () => void;
  setFalse: () => void;
  set: (value: boolean) => void;
  toggle: () => void;
}

export default function useBoolean(defaultValue = false): [boolean, Actions] {
  const [state, { toggle, set }] = useToggle(defaultValue);

  const actions: Actions = useMemo(() => {
    const setTrue = () => set(true);
    const setFalse = () => set(false);
    return {
      toggle,
      set: (v) => set(!!v),
      setTrue,
      setFalse,
    };
  }, []);

  return [state, actions];
}
```

核心实现思路和 useToggle 基本一致，具体实习思路可请看
[【ahooks 源码学习】—— useToggle](https://juejin.cn/post/7208420221042999356)

这里发现一个小小的缺陷：useBoolean 的初始值问题，当初始值传入是非 boolean 类型的数据时，点击 toggle 时。是一个非 boolean 类型的初始值和一个 boolean 值在切换。  
比如传入参数是 123，点击 toggle 方法，此时 state 在 123 和 false 之间来回转换。当点击 setTrue，再点击 toggle 方法，我理解 state 应该变成由 true 变成 false，而实际情况是变成了 123。

是否可以将初始值转化成一个 boolean 类型的数据后，再进行使用呢。

已给官方提交[pr](https://github.com/alibaba/hooks/issues/2104)

## 测试源码分析

```
import { renderHook, act } from '@testing-library/react';
import useBoolean from '../index';

const setUp = (defaultValue?: boolean) => renderHook(() => useBoolean(defaultValue));

describe('useBoolean', () => {
  it('test on methods', async () => {
    const { result } = setUp();
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1].setTrue();
    });
    expect(result.current[0]).toBe(true);
    act(() => {
      result.current[1].setFalse();
    });
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1].toggle();
    });
    expect(result.current[0]).toBe(true);
    act(() => {
      result.current[1].toggle();
    });
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1].set(false);
    });
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1].set(true);
    });
    expect(result.current[0]).toBe(true);
    act(() => {
      // @ts-ignore
      result.current[1].set(0);
    });
    expect(result.current[0]).toBe(false);
    act(() => {
      // @ts-ignore
      result.current[1].set('a');
    });
    expect(result.current[0]).toBe(true);
  });

  it('test on default value', () => {
    const hook = setUp(true);
    expect(hook.result.current[0]).toBe(true);
  });
});
```

首先，使用了 `@testing-library/react` 中的 `renderHook` 和 `act` 两个方法进行测试。`setUp` 函数用于创建一个新的 Hook 实例。

第一个测试用例 `test on methods` 针对 `useBoolean` hook 的方法进行测试。在这个测试用例中，首先创建了一个 Hook 实例，然后通过断言测试了 `useBoolean` 返回的值是否符合预期，如调用 `setTrue` 后结果为 true。同时，也测试了一些非法参数的情况，例如传入数字 0 或字符串 'a' 等值。

第二个测试用例 `test on default value` 针对传入默认值的情况进行测试。它创建了一个带有默认值的 Hook 实例，并通过断言测试了 `useBoolean` 返回的默认值是否符合预期。
