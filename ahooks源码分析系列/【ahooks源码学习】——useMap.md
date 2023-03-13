---
theme: channing-cyan
highlight: a11y-light
---

## 介绍

ahooks 是一个基于 React Hooks 的实用工具库，提供了许多常用的 Hooks，本文中源码的版本是`ahooks3.7.5`。

`useMap` 允许您在 React 组件中使用类似于 Map 的数据结构。该 Hook 返回一个可变的 Map 实例，并允许您添加、删除和更新键值对。

具体使用方法见 ahooks 官网：
[useMap 的使用方法](https://ahooks.js.org/zh-CN/hooks/use-map)

本系列已收集到专栏[ahooks 源码分析](https://juejin.cn/column/7208359523382231101)  
同步到[github 前端学习之路](https://github.com/KangXinzhi/front-end-study)

## 使用场景

使用 useMap 可以方便地在 React 组件中管理键值对。它特别适用于以下场景：

- 管理复杂的表单数据；
- 存储和处理用户的输入；
- 管理需要添加、删除、更新、查询的数据结构。

## 返回参数分析

useMap 返回一个数组，其中包含两个元素：

1.  map：一个可变的 Map 实例，用于存储键值对；
2.  object：一个包含 set、setAll、remove、reset 和 get 函数的对象，用于操作 Map 实例。

下面是返回参数的属性：

| 参数   | 说明                  | 类型                                 |
| ------ | --------------------- | ------------------------------------ |
| map    | Map 对象              | `Map<K, V>`                          |
| set    | 添加元素              | `(key: K, value: V) => void`         |
| get    | 获取元素              | `(key: K) => V \| undefined`         |
| setAll | 生成一个新的 Map 对象 | `(newMap: Iterable<[K, V]>) => void` |
| remove | 移除元素              | `(key: K) => void`                   |
| reset  | 重置为默认值          | `() => void`                         |

## 源码学习

useMap 的源码非常简单，它使用 useState 和 useMemoizedFn 实现。
useMemoizedFn 可以理解是 useCallback 的封装。

下面是源码和注释：

```
import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';

function useMap<K, T>(initialValue?: Iterable<readonly [K, T]>) {
  // getInitValue 函数返回一个新的 Map 实例，如果有初始值，将其传递给 Map 构造函数。
  const getInitValue = () => {
    return initialValue === undefined ? new Map() : new Map(initialValue);
  };

  // 使用 useState 创建一个可变的 Map 实例，并将 getInitValue 函数传递给 useState。
  const [map, setMap] = useState<Map<K, T>>(() => getInitValue());

  // 定义 set 函数，用于添加键值对。
  const set = (key: K, entry: T) => {
    setMap((prev) => {
      const temp = new Map(prev);
      temp.set(key, entry);
      return temp;
    });
  };

  // 定义 setAll 函数，用于添加多个键值对。
  const setAll = (newMap: Iterable<readonly [K, T]>) => {
    setMap(new Map(newMap));
  };

  // 定义 remove 函数，用于删除指定键的键值对。
  const remove = (key: K) => {
    setMap((prev) => {
      const temp = new Map(prev);
      temp.delete(key);
      return temp;
    });
  };

  // 定义 reset 函数，用于将 Map 重置为
  const reset = () => setMap(getInitValue());

  const get = (key: K) => map.get(key);

  return [
    map,
    {
      set: useMemoizedFn(set),
      setAll: useMemoizedFn(setAll),
      remove: useMemoizedFn(remove),
      reset: useMemoizedFn(reset),
      get: useMemoizedFn(get),
    },
  ] as const;
}

export default useMap;

```

## 测试源码分析

```
import { act, renderHook } from '@testing-library/react';
import useMap from '../index';

const setup = (initialMap?: Iterable<[any, any]>) => renderHook(() => useMap(initialMap));

describe('useMap', () => {
  it('should init map and utils', () => {
    const { result } = setup([
      ['foo', 'bar'],
      ['a', 1],
    ]);
    const [map, utils] = result.current;

    expect(Array.from(map)).toEqual([
      ['foo', 'bar'],
      ['a', 1],
    ]);
    expect(utils).toStrictEqual({
      get: expect.any(Function),
      set: expect.any(Function),
      setAll: expect.any(Function),
      remove: expect.any(Function),
      reset: expect.any(Function),
    });
  });

  it('should init empty map if not initial object provided', () => {
    const { result } = setup();

    expect([...result.current[0]]).toEqual([]);
  });

  it('should get corresponding value for initial provided key', () => {
    const { result } = setup([
      ['foo', 'bar'],
      ['a', 1],
    ]);
    const [, utils] = result.current;

    let value;
    act(() => {
      value = utils.get('a');
    });

    expect(value).toBe(1);
  });

  it('should get corresponding value for existing provided key', () => {
    const { result } = setup([
      ['foo', 'bar'],
      ['a', 1],
    ]);

    act(() => {
      result.current[1].set('a', 99);
    });

    let value;
    act(() => {
      value = result.current[1].get('a');
    });

    expect(value).toBe(99);
  });

  it('should get undefined for non-existing provided key', () => {
    const { result } = setup([
      ['foo', 'bar'],
      ['a', 1],
    ]);
    const [, utils] = result.current;

    let value;
    act(() => {
      value = utils.get('nonExisting');
    });

    expect(value).toBeUndefined();
  });

  it('should set new key-value pair', () => {
    const { result } = setup([
      ['foo', 'bar'],
      ['a', 1],
    ]);
    const [, utils] = result.current;

    act(() => {
      utils.set('newKey', 99);
    });

    expect([...result.current[0]]).toEqual([
      ['foo', 'bar'],
      ['a', 1],
      ['newKey', 99],
    ]);
  });

  it('should override current value if setting existing key', () => {
    const { result } = setup([
      ['foo', 'bar'],
      ['a', 1],
    ]);
    const [, utils] = result.current;

    act(() => {
      utils.set('foo', 'qux');
    });

    expect([...result.current[0]]).toEqual([
      ['foo', 'qux'],
      ['a', 1],
    ]);
  });

  it('should set new map', () => {
    const { result } = setup([
      ['foo', 'bar'],
      ['a', 1],
    ]);
    const [, utils] = result.current;

    act(() => {
      utils.setAll([
        ['foo', 'foo'],
        ['a', 2],
      ]);
    });

    expect([...result.current[0]]).toEqual([
      ['foo', 'foo'],
      ['a', 2],
    ]);
  });

  it('remove should be work', () => {
    const { result } = setup([['msg', 'hello']]);
    const { remove } = result.current[1];
    expect(result.current[0].size).toBe(1);
    act(() => {
      remove('msg');
    });
    expect(result.current[0].size).toBe(0);
  });

  it('reset should be work', () => {
    const { result } = setup([['msg', 'hello']]);
    const { set, reset } = result.current[1];
    act(() => {
      set('text', 'new map');
    });
    expect([...result.current[0]]).toEqual([
      ['msg', 'hello'],
      ['text', 'new map'],
    ]);
    act(() => {
      reset();
    });
    expect([...result.current[0]]).toEqual([['msg', 'hello']]);
  });
});

```

- should init map and utils：测试初始化 Map 和 Utils 函数
- should get corresponding value for initial provided key、should get corresponding value for existing provided key、should get undefined for non-existing provided key：测试从 Map 中获取对应键的值
- should set new key-value pair：测试为新的键值对设置键和值
- should override current value if setting existing key：测试设置现有键的值的覆盖
- should set new map：测试设置新的 Map
- remove should be work：测试删除键值对
- reset should be work：测试重置 Ma

## pr 贡献

个人感觉源码中获取初始值方法

```
const getInitValue = () => {
  return initialValue === undefined ? new Map() : new Map(initialValue);
};
```

判断 initialValue 是不是等于 undefined 无太大意义，因为 new Map(undefined)的返回结果是和 new Map(）完全相等的。

又添加了一些 case 测试用例  
[pr 在这里](https://github.com/alibaba/hooks/pull/2116)
