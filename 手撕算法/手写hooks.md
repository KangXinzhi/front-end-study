```
const useState = defaultValue => {
    const value = useRef(defaultValue);
    
    const setValue = newValue => {
        if (typeof newValue === 'function') {
            value.current = newValue(value.current);
        } else {
            value.current = value;
        }
    }
    
    //  触发组件的重新渲染
    dispatchAction();
    
    return [value, setValue];
}

```

```

function useCustomState(defaultValue) {
  const [_, forceRender] = useReactState({}); // 用来强制刷新
  const valueRef = useRef(defaultValue);

  const setValue = useCallback((newValue) => {
    if (typeof newValue === 'function') {
      valueRef.current = newValue(valueRef.current);
    } else {
      valueRef.current = newValue;
    }
    forceRender({}); // 强制刷新组件
  }, []);

  return [valueRef.current, setValue];
}
```



```
function useMemo(fn, deps) {
  const [value, setValue] = useState();
  const depsRef = useRef(deps);

  if (depsRef.current !== deps) {
    setValue(fn());
    depsRef.current = deps;
  }

  return value;
}
```

```
function useMemo(fn, deps) {
  const memoized = useRef({ value: undefined, deps: undefined });

  // 比较依赖是否变化
  const hasChanged =
    !memoized.current.deps ||
    deps.length !== memoized.current.deps.length ||
    deps.some((d, i) => d !== memoized.current.deps[i]);

  if (hasChanged) {
    memoized.current.value = fn();   // 重新计算
    memoized.current.deps = deps;   // 更新依赖
  }

  return memoized.current.value;
}
```

```
import isEqual from 'lodash.isequal';

export function useDeepMemo<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<{ value: T; deps: any[] }>();

  // 直接整体深比较
  if (!ref.current || !isEqual(deps, ref.current.deps)) {
    ref.current = {
      value: factory(),
      deps,
    };
  }

  return ref.current.value;
}
```