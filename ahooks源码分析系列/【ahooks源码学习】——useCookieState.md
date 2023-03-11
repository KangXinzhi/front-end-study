---
theme: channing-cyan
highlight: a11y-light
---

## 介绍

ahooks 是一个基于 React Hooks 的实用工具库，提供了许多常用的 Hooks，本文中源码的版本是`ahooks3.7.5`。

`useCookieState` 一个可以将状态存储在 Cookie 中的 Hook。可以帮助我们在浏览器的 Cookie 中存储和更新状态。它通过调用`js-cookie`库提供的方法，可以轻松实现在浏览器中存储状态，方便进行状态管理。

`useCookieState`具体使用方法见 ahooks 官网：
[useCookieState 的使用方法](https://ahooks.js.org/zh-CN/hooks/use-cookie-state#%E5%B0%86-state-%E5%AD%98%E5%82%A8%E5%9C%A8-cookie-%E4%B8%AD)

本系列已收集到专栏[ahooks 源码分析](https://juejin.cn/column/7208359523382231101)  
同步到[github 前端学习之路](https://github.com/KangXinzhi/front-end-study)

## 使用场景

`useCookieState`的使用场景是在需要在浏览器中进行状态存储的时候，例如：

- 网站主题、语言等偏好设置的存储
- 在用户退出登录之后，可以存储用户之前的状态并在下次登录时还原状态
- 在跨页面之间共享数据的时候

使用`useCookieState`可以避免在不同页面之间传递状态，从而提高应用程序的性能和可维护性。

## 源码学习

```
import Cookies from 'js-cookie';
import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import useUpdateEffect from '../useUpdateEffect';
import { isFunction, isString, isUndef } from '../utils';

export type State = string | undefined;

export interface Options extends Cookies.CookieAttributes {
  defaultValue?: State | (() => State);
}

function useCookieState(cookieKey: string, options: Options = {}) {
  function getDefaultValue() {
    return isFunction(options?.defaultValue) ? options?.defaultValue() : options?.defaultValue;
  }

  function setStoredValue(newValue: State, newOptions: Cookies.CookieAttributes = {}) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { defaultValue, ...restOptions } = newOptions;

    if (isUndef(newValue)) {
      Cookies.remove(cookieKey);
    } else {
      Cookies.set(cookieKey, newValue, restOptions);
    }
  }

  function getStoredValue() {
    const cookieValue = Cookies.get(cookieKey);

    if (isString(cookieValue)) return cookieValue;

    const defaultValue = getDefaultValue();

    setStoredValue(defaultValue);

    return defaultValue;
  }

  const [state, setState] = useState<State>(() => getStoredValue());

  useUpdateEffect(() => {
    setState(getStoredValue());
  }, [cookieKey]);

  const updateState = useMemoizedFn(
    (
      newValue: State | ((prevState: State) => State),
      newOptions: Cookies.CookieAttributes = {},
    ) => {
      const currentValue = isFunction(newValue) ? newValue(state) : newValue;

      setState(currentValue);
      setStoredValue(currentValue, newOptions);
    },
  );

  return [state, updateState] as const;
}

export default useCookieState;

```

核心实现思路和`useLocalStorageState`基本一致，具体实现思路可请看：
[【ahooks 源码学习】—— useLocalStorageState/useSessionStorageState](https://juejin.cn/post/7208817601840136248)

不同之处在于调用了调用`js-cookie`库提供的基本方法。

`setStoredValue`函数用于设置 Cookie 的值。如果`newValue`为 undefined，则删除 Cookie，否则将`newValue`存储在 Cookie 中。在存储之前，`setStoredValue`会过滤掉`newOptions`中的`defaultValue`属性，因为这个属性只用于设置默认值，不应该影响 Cookie 的值。

`getStoredValue`函数用于获取 Cookie 的值。首先尝试从 Cookie 中获取值，如果值存在则直接返回；否则调用`getDefaultValue`获取默认值，并将默认值存储在 Cookie 中，最后返回默认值。

## 测试源码分析

```
import React, { useState } from 'react';
import { renderHook, act, render, fireEvent } from '@testing-library/react';
import useCookieState from '../index';
import type { Options } from '../index';
import Cookies from 'js-cookie';

describe('useCookieState', () => {
  const setUp = (key: string, options: Options) =>
    renderHook(() => {
      const [state, setState] = useCookieState(key, options);
      return {
        state,
        setState,
      } as const;
    });

  it('defaultValue should work', () => {
    const COOKIE = {
      KEY: 'test-key-with-default-value',
      KEY2: 'test-key-with-default-value2',
      DEFAULT_VALUE: 'A',
      DEFAULT_VALUE2: 'A2',
    };
    const Setup = () => {
      const [key, setKey] = useState<string>(COOKIE.KEY);
      const [defaultValue, setDefaultValue] = useState<string>(COOKIE.DEFAULT_VALUE);
      const [state] = useCookieState(key, { defaultValue });

      return (
        <>
          <div role="state">{state}</div>
          <button
            role="button"
            onClick={() => {
              setKey(COOKIE.KEY2);
              setDefaultValue(COOKIE.DEFAULT_VALUE2);
            }}
          />
        </>
      );
    };
    const wrap = render(<Setup />);

    // Initial value
    expect(wrap.getByRole('state').textContent).toBe(COOKIE.DEFAULT_VALUE);
    expect(Cookies.get(COOKIE.KEY)).toBe(COOKIE.DEFAULT_VALUE);

    // Change `key` and `defaultValue`
    act(() => fireEvent.click(wrap.getByRole('button')));
    expect(Cookies.get(COOKIE.KEY)).toBe(COOKIE.DEFAULT_VALUE);
    expect(Cookies.get(COOKIE.KEY2)).toBe(COOKIE.DEFAULT_VALUE2);
  });

  it('getKey should work', () => {
    const COOKIE = 'test-key';
    const hook = setUp(COOKIE, {
      defaultValue: 'A',
    });
    expect(hook.result.current.state).toBe('A');
    act(() => {
      hook.result.current.setState('B');
    });
    expect(hook.result.current.state).toBe('B');
    const anotherHook = setUp(COOKIE, {
      defaultValue: 'A',
    });
    expect(anotherHook.result.current.state).toBe('B');
    act(() => {
      anotherHook.result.current.setState('C');
    });
    expect(anotherHook.result.current.state).toBe('C');
    expect(hook.result.current.state).toBe('B');
  });

  it('should support undefined', () => {
    const COOKIE = 'test-boolean-key-with-undefined';
    const hook = setUp(COOKIE, {
      defaultValue: 'undefined',
    });
    expect(hook.result.current.state).toBe('undefined');
    act(() => {
      hook.result.current.setState(undefined);
    });
    expect(hook.result.current.state).toBeUndefined();
    const anotherHook = setUp(COOKIE, {
      defaultValue: 'false',
    });
    expect(anotherHook.result.current.state).toBe('false');
  });

  it('should support empty string', () => {
    Cookies.set('test-key-empty-string', '');
    expect(Cookies.get('test-key-empty-string')).toBe('');
    const COOKIE = 'test-key-empty-string';
    const hook = setUp(COOKIE, {
      defaultValue: 'hello',
    });
    expect(hook.result.current.state).toBe('');
  });

  it('should support function updater', () => {
    const COOKIE = 'test-func-updater';
    const hook = setUp(COOKIE, {
      defaultValue: () => 'hello world',
    });
    expect(hook.result.current.state).toBe('hello world');
    act(() => {
      hook.result.current.setState((state) => `${state}, zhangsan`);
    });
    expect(hook.result.current.state).toBe('hello world, zhangsan');
  });
});
```

`defaultValue should work`：这个测试用例主要测试了 useCookieState hook 的 defaultValue 是否初始化时是否被存储到 cookie 中。

`getKey should work`：这个测试用例主要测试了在多个组件中使用同一个`key`时，它们是否能够正确地共享状态。

`should support undefined`：这个测试用例主要测试了 useCookieState hook 是否支持将 cookie 中的值设置为 undefined，以及在状态更新时能否正确地处理这种情况。

`should support empty string`：这个测试用例主要测试了 useCookieState hook 是否支持将 cookie 中的值设置为空字符串''，并且在默认值为非空字符串时，是否能够正确地获取和处理这个空字符串的值。

`should support function updater`：这个测试用例主要测试了 useCookieState hook 是否支持使用函数作为状态更新的参数。

### pr 贡献

提交个[pr](https://github.com/alibaba/hooks/pull/2112)贡献一些测试用例和修复官网文档错误。

```
it('using the same cookie name', () => {
    const COOKIE_NAME = 'test-same-cookie-name';
    const { result: result1 } = setUp(COOKIE_NAME, { defaultValue: 'A' });
    const { result: result2 } = setUp(COOKIE_NAME, { defaultValue: 'B' });
    expect(result1.current.state).toBe('A');
    expect(result2.current.state).toBe('A');
    act(() => {
      result1.current.setState('B');
    });
    expect(result1.current.state).toBe('B');
    expect(result2.current.state).toBe('A');
    expect(Cookies.get(COOKIE_NAME)).toBe('B');
    act(() => {
      result2.current.setState('C');
    });
    expect(result1.current.state).toBe('B');
    expect(result2.current.state).toBe('C');
    expect(Cookies.get(COOKIE_NAME)).toBe('C');
  });
```
