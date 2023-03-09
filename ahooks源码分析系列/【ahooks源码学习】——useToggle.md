# useToggle

## 介绍

在 React 开发中，状态管理是一个重要的问题。ahooks 是一个由 Alibaba 开发的 React Hooks 库，其中的`useToggle`提供了一种便捷的方式来管理布尔值类型的状态。

`useToggle`可以用于在两个状态之间进行切换，例如开关状态。除此之外，它还可以被用于管理任何数据类型的状态。

本文将分析`ahooks3.7.5`版本下`useToggle`的实现源代码，讨论它的使用方法和参数，以及它是如何管理状态的。

## 源码学习

源代码中的`useToggle`函数提供了三个重载函数，分别处理不同的情况。

```
import { useMemo, useState } from 'react';

export interface Actions<T> {
  setLeft: () => void;
  setRight: () => void;
  set: (value: T) => void;
  toggle: () => void;
}

function useToggle<T = boolean>(): [boolean, Actions<T>];

function useToggle<T>(defaultValue: T): [T, Actions<T>];

function useToggle<T, U>(defaultValue: T, reverseValue: U): [T | U, Actions<T | U>];

function useToggle<D, R>(defaultValue: D = false as unknown as D, reverseValue?: R) {
  const [state, setState] = useState<D | R>(defaultValue);

  const actions = useMemo(() => {
    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;

    const toggle = () => setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue));
    const set = (value: D | R) => setState(value);
    const setLeft = () => setState(defaultValue);
    const setRight = () => setState(reverseValueOrigin);

    return {
      toggle,
      set,
      setLeft,
      setRight,
    };
    // useToggle ignore value change
    // }, [defaultValue, reverseValue]);
  }, []);

  return [state, actions];
}

export default useToggle;

```

其中，第一个重载函数不接受任何参数，返回一个元组。该元组的第一个值是布尔类型的状态值，第二个值是包含`setLeft`，`setRight`，`set`和`toggle`四个函数的对象。

第二个重载函数接受一个参数，返回一个元组。该元组的第一个值是该参数类型的状态值，第二个值是包含`setLeft`，`setRight`，`set`和`toggle`四个函数的对象。

第三个重载函数接受两个参数，分别是初始状态值和一个可选的反转值。返回一个元组，元组的第一个值可以是初始状态值或者反转值，第二个值是包含`setLeft`，`setRight`，`set`和`toggle`四个函数的对象。

在`useToggle`函数内部，使用`useState` Hook 来管理状态。同时，使用`useMemo` Hook 来缓存包含`setLeft`，`setRight`，`set`和`toggle`四个函数的对象，以便于性能优化。

在`actions`对象中，`toggle`函数用于切换状态，`set`函数用于设置状态值，`setLeft`函数用于将状态值设置为初始状态值，`setRight`函数用于将状态值设置为反转值。

## 使用方法和场景

使用`useToggle`函数时，可以选择不同的参数类型。在第一个重载函数中，不接受任何参数，因此默认状态值为布尔类型的`false`。在第二个和第三个重载函数中，可以指定状态值的类型，例如字符串或数字类型。

如果在第三个重载函数中指定了反转值，那么在切换状态时，状态值将在初始状态值和反转值之间切换。如果没有指定反转值，则状态值将在`true`和`false`之间切换。

使用方法

使用`useToggle`函数时，只需要调用它并将其返回值解构为需要的变量即可。例如，在使用第一个重载函数时，可以这样做：

```
import useToggle from 'ahooks';

const [state, { toggle }] = useToggle();

<button onClick={toggle}>{state ? 'On' : 'Off'}</button>
```

当用户点击按钮时，`toggle`函数将在`true`和`false`之间切换状态，并且按钮上的文本将随之改变。

如果需要使用第二个或第三个重载函数，只需要传递相应的参数即可。例如，如果需要使用字符串类型的状态值，可以这样做：

```
const [text, { toggle }] = useToggle('Hello, world!'); <button onClick={toggle}>{text}</button>
```

在这个例子中，`text`变量的初始值为`Hello, world!`，当用户点击按钮时，它的值将在`Hello, world!`和`false`之间切换。

## 状态管理

`useToggle`函数通过`useState` Hook 来管理状态。在初始状态下，它返回给定的默认值或反转值。当用户调用`toggle`函数时，它将根据当前状态值来选择返回默认值或反转值。在这个过程中，`setState`函数将被调用来更新状态。

`setLeft`和`setRight`函数分别用于将状态值设置为默认值或反转值，而`set`函数则用于将状态值设置为任何其他值。

## 结论

`useToggle`是一个方便的 React Hooks 函数，可以用于管理布尔类型和其他数据类型的状态。它可以用于在两个状态之间切换，例如开关状态。此外，它还提供了一些辅助函数，例如`setLeft`和`setRight`，可以用于在状态之间进行切换。通过使用`useState`和`useMemo` Hook，`useToggle`可以高效地管理状态，避免了手动管理状态带来的复杂性。

## 测试源码学习

```
import { renderHook, act } from '@testing-library/react';
import useToggle from '../index';

const callToggle = (hook: any) => {
  act(() => {
    hook.result.current[1].toggle();
  });
};

describe('useToggle', () => {
  // 第一个测试用例，检查useToggle函数的初始状态默认值为false
  it('test on init', async () => {
    const hook = renderHook(() => useToggle());
    expect(hook.result.current[0]).toBeFalsy();
  });


  // 第二个测试用例，测试useToggle函数中的toggle、setLeft、setRight等方法
  it('test on methods', async () => {
    const hook = renderHook(() => useToggle('Hello'));
    expect(hook.result.current[0]).toBe('Hello');
    act(() => {
      hook.result.current[1].toggle();
    });
    expect(hook.result.current[0]).toBeFalsy();
    act(() => {
      hook.result.current[1].setLeft();
    });
    expect(hook.result.current[0]).toBe('Hello');
    act(() => {
      hook.result.current[1].setRight();
    });
    expect(hook.result.current[0]).toBeFalsy();
  });

  // 第三个测试用例，测试useToggle函数中的可选参数
  it('test on optional', () => {
    const hook = renderHook(() => useToggle('Hello', 'World'));
    callToggle(hook);
    expect(hook.result.current[0]).toBe('World');
    act(() => {
      hook.result.current[1].set('World');
    });
    expect(hook.result.current[0]).toBe('World');
    callToggle(hook);
    expect(hook.result.current[0]).toBe('Hello');
  });
});
```

`renderHook`和`act`是 React 测试库`@testing-library/react`提供的两个工具函数。

`renderHook`用于在测试中渲染 React Hooks，它提供了一个类似于 React 组件的环境来测试 Hooks 的行为，可以轻松模拟出 Hook 的使用场景，并且可以获取 Hook 的返回值和状态。

`act`则用于模拟 React 组件中的行为，比如用户的交互行为、异步操作等，通过使用`act`可以确保 React 在处理这些行为时会进行必要的更新，从而保证测试的正确性。

在使用`renderHook`时，通常需要在`act`中包裹需要测试的操作，比如调用 Hook 函数、触发事件等等，以确保在测试过程中 React 能够正确地更新组件的状态。
