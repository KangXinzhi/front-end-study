---
theme: channing-cyan
highlight: a11y-light
---

## 介绍

ahooks 是一个基于 React Hooks 的实用工具库，提供了许多常用的 Hooks，本文中源码的版本是`ahooks3.7.5`。

`useLocalStorageState` 和 `useSessionStorageState`分别是分装了 localStorage 和 sessionStorage 的方法。都是用于在 React 组件中管理浏览器存储中的数据的。唯一的区别在于它们分别将数据存储在会话存储和本地存储中。

具体使用方法见 ahooks 官网：
[useLocalStorageState 的使用方法](https://ahooks.js.org/zh-CN/hooks/use-local-storage-state#%E4%BB%A3%E7%A0%81%E6%BC%94%E7%A4%BA)

本系列已收集到专栏[ahooks 源码分析](https://juejin.cn/column/7208359523382231101)  
同步到[github 前端学习之路](https://github.com/KangXinzhi/front-end-study)

## 使用场景

`useLocalStorageState`和`useSessionStorageState`可以存储数据的场景，比如：

- 记录用户的偏好设置：比如网站主题、语言偏好等。
- 存储用户填写的表单数据，以便在页面刷新或者重新加载时不会丢失数据。
- 缓存用户数据：比如一些需要长时间计算的数据或者需要在多个页面中共享的数据。

需要注意的是，由于 `sessionStorage` 存储的数据仅在当前会话期间有效，因此 `useSessionStorageState` 并不适合用来存储长期有效的数据，如果需要长期存储数据，应该使用 `useLocalStorageState` 或者其他持久化存储方案。

## 源码分析

`useLocalStorageState`和`useSessionStorageState`都是借助于`createUseStorageState`方法实现的。

`useLocalStorageState`源码:

```
import { createUseStorageState } from '../createUseStorageState';
import isBrowser from '../utils/isBrowser';

const useLocalStorageState = createUseStorageState(() => (isBrowser ? localStorage : undefined));

export default useLocalStorageState;
```

useSessionStorageState 源码:

```
import { createUseStorageState } from '../createUseStorageState';
import isBrowser from '../utils/isBrowser';

const useSessionStorageState = createUseStorageState(() =>
  isBrowser ? sessionStorage : undefined,
);

export default useSessionStorageState;

```

createUseStorageState 源码：

```
/* eslint-disable no-empty */
import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import useUpdateEffect from '../useUpdateEffect';
import { isFunction, isUndef } from '../utils';

export interface IFuncUpdater<T> {
  (previousState?: T): T;
}
export interface IFuncStorage {
  (): Storage;
}

export interface Options<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  defaultValue?: T | IFuncUpdater<T>;
}

export function createUseStorageState(getStorage: () => Storage | undefined) {
  function useStorageState<T>(key: string, options?: Options<T>) {
    let storage: Storage | undefined;

    // https://github.com/alibaba/hooks/issues/800
    try {
      storage = getStorage();
    } catch (err) {
      console.error(err);
    }

    const serializer = (value: T) => {
      if (options?.serializer) {
        return options?.serializer(value);
      }
      return JSON.stringify(value);
    };

    const deserializer = (value: string) => {
      if (options?.deserializer) {
        return options?.deserializer(value);
      }
      return JSON.parse(value);
    };

    function getDefaultValue() {
      return isFunction(options?.defaultValue) ? options?.defaultValue() : options?.defaultValue;
    }

    function setStoredValue(value?: T) {
      if (isUndef(value)) {
        storage?.removeItem(key);
      } else {
        try {
          storage?.setItem(key, serializer(value));
        } catch (e) {
          console.error(e);
        }
      }
    }

    function getStoredValue() {
      try {
        const raw = storage?.getItem(key);
        if (raw) {
          return deserializer(raw);
        }
      } catch (e) {
        console.error(e);
      }

      const defaultValue = getDefaultValue();

      setStoredValue(defaultValue);

      return defaultValue;
    }

    const [state, setState] = useState<T>(() => getStoredValue());

    useUpdateEffect(() => {
      setState(getStoredValue());
    }, [key]);

    const updateState = (value: T | IFuncUpdater<T>) => {
      const currentState = isFunction(value) ? value(state) : value;

      setState(currentState);
      setStoredValue(currentState);
    };

    return [state, useMemoizedFn(updateState)] as const;
  }
  return useStorageState;
}

```

`useLocalStorageState` 是基于 `createUseStorageState` 实现的，`createUseStorageState` 接受一个 `getStorage` 函数作为参数，用于获取 localStorage 或 sessionStorage 对象。

`useLocalStorageState` 中会先调用 `createUseStorageState` 生成一个 `useStorageState` hook，然后将 `window.localStorage` 对象传递给 `createUseStorageState`，以此来实现 localStorage 的存储功能。

在 `useStorageState` 中，首先通过 `getStorage` 函数获取到了 localStorage 对象，并定义了 `serializer` 和 `deserializer` 函数，用于将值序列化为字符串和反序列化为值。

然后定义了 `getDefaultValue`、`setStoredValue` 和 `getStoredValue` 函数。`getDefaultValue` 用于获取默认值，`setStoredValue` 用于将值存储到 localStorage 中，`getStoredValue` 用于从 localStorage 中读取值。如果 localStorage 中没有存储值，则会从 `options.defaultValue` 获取默认值，并将默认值存储到 localStorage 中。

最后，使用 `useState` 和 `useUpdateEffect` 实现了 hook 的主要逻辑。`useState` 用于存储当前的值，`useUpdateEffect` 则用于在 key 变化时更新值。

在返回值时，通过 `useMemoizedFn` 将 `updateState` 函数包装成一个 memoized 函数，避免在每次 render 时都重新创建一个新的函数。

## 测试源码分析

分析 useLocalStorageState 的测试源码：

```
import { renderHook, act } from '@testing-library/react';
import useLocalStorageState from '../index';

describe('useLocalStorageState', () => {
  const setUp = <T>(key: string, value: T) =>
    renderHook(() => {
      const [state, setState] = useLocalStorageState<T>(key, { defaultValue: value });
      return {
        state,
        setState,
      } as const;
    });

  it('getKey should work', () => {
    const LOCAL_STORAGE_KEY = 'test-key';
    const hook = setUp(LOCAL_STORAGE_KEY, 'A');
    expect(hook.result.current.state).toBe('A');
    act(() => {
      hook.result.current.setState('B');
    });
    expect(hook.result.current.state).toBe('B');
    const anotherHook = setUp(LOCAL_STORAGE_KEY, 'A');
    expect(anotherHook.result.current.state).toBe('B');
    act(() => {
      anotherHook.result.current.setState('C');
    });
    expect(anotherHook.result.current.state).toBe('C');
    expect(hook.result.current.state).toBe('B');
  });

  it('should support object', () => {
    const LOCAL_STORAGE_KEY = 'test-object-key';
    const hook = setUp<{ name: string }>(LOCAL_STORAGE_KEY, {
      name: 'A',
    });
    expect(hook.result.current.state).toEqual({ name: 'A' });
    act(() => {
      hook.result.current.setState({ name: 'B' });
    });
    expect(hook.result.current.state).toEqual({ name: 'B' });
    const anotherHook = setUp(LOCAL_STORAGE_KEY, {
      name: 'C',
    });
    expect(anotherHook.result.current.state).toEqual({ name: 'B' });
    act(() => {
      anotherHook.result.current.setState({
        name: 'C',
      });
    });
    expect(anotherHook.result.current.state).toEqual({ name: 'C' });
    expect(hook.result.current.state).toEqual({ name: 'B' });
  });

  it('should support number', () => {
    const LOCAL_STORAGE_KEY = 'test-number-key';
    const hook = setUp(LOCAL_STORAGE_KEY, 1);
    expect(hook.result.current.state).toBe(1);
    act(() => {
      hook.result.current.setState(2);
    });
    expect(hook.result.current.state).toBe(2);
    const anotherHook = setUp(LOCAL_STORAGE_KEY, 3);
    expect(anotherHook.result.current.state).toBe(2);
    act(() => {
      anotherHook.result.current.setState(3);
    });
    expect(anotherHook.result.current.state).toBe(3);
    expect(hook.result.current.state).toBe(2);
  });

  it('should support boolean', () => {
    const LOCAL_STORAGE_KEY = 'test-boolean-key';
    const hook = setUp(LOCAL_STORAGE_KEY, true);
    expect(hook.result.current.state).toBe(true);
    act(() => {
      hook.result.current.setState(false);
    });
    expect(hook.result.current.state).toBe(false);
    const anotherHook = setUp(LOCAL_STORAGE_KEY, true);
    expect(anotherHook.result.current.state).toBe(false);
    act(() => {
      anotherHook.result.current.setState(true);
    });
    expect(anotherHook.result.current.state).toBe(true);
    expect(hook.result.current.state).toBe(false);
  });

  it('should support null', () => {
    const LOCAL_STORAGE_KEY = 'test-boolean-key-with-null';
    const hook = setUp<boolean | null>(LOCAL_STORAGE_KEY, false);
    expect(hook.result.current.state).toBe(false);
    act(() => {
      hook.result.current.setState(null);
    });
    expect(hook.result.current.state).toBeNull();
    const anotherHook = setUp(LOCAL_STORAGE_KEY, false);
    expect(anotherHook.result.current.state).toBeNull();
  });

  it('should support function updater', () => {
    const LOCAL_STORAGE_KEY = 'test-func-updater';
    const hook = setUp<string | null>(LOCAL_STORAGE_KEY, 'hello world');
    expect(hook.result.current.state).toBe('hello world');
    act(() => {
      hook.result.current.setState((state) => `${state}, zhangsan`);
    });
    expect(hook.result.current.state).toBe('hello world, zhangsan');
  });
});
```

第一个测试用例测试 getKey 函数是否正常工作。它创建一个新的 hook 实例，将初始值设置为'A'，并使用 act 更新值为'B'。然后它创建了另一个实例，并验证该值是否为'B'。然后使用 act 再次更新值为'C'，并检查另一个实例的值是否更新为'C'，以及第一个实例的值是否仍然为'B'。

接下来的三个测试用例测试了不同类型的值是否能够正确地存储和更新。这些测试用例测试了对象、数字和布尔类型的值，并确保它们可以正确地存储和更新。

最后一个测试用例测试了函数 updater 是否能够正确地工作。它创建了一个字符串值的 hook 实例，并使用 act 更新它。更新函数将当前状态作为参数，将其与其他字符串连接起来，并将其设置为新的状态。然后，它检查状态是否更新为新的字符串。

### pr 贡献

发现其缺少了检测默认值是否能够正确地保存在本地存储中的测试用例。

```
  it('should save the default value in localStorage', () => {
    const LOCAL_STORAGE_KEY = 'test-default-value-key';
    const defaultValue = 'Hello';
    const hook = setUp(LOCAL_STORAGE_KEY, defaultValue);
    expect(hook.result.current.state).toBe(defaultValue);
    const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    expect(localStorageValue).toBe(JSON.stringify(defaultValue));
  });
```

提交一个[pr](https://github.com/alibaba/hooks/commit/37749a3a9a6927162e4c68146c9e06a0dffb32f9)
