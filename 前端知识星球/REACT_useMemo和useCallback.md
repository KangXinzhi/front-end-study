1. 组件什么时候会 re-render
- 当本身的 props 或 state 改变时。
- Context value 改变时，使用该值的组件会 re-render。
- 当父组件重新渲染时，它所有的子组件都会 re-render，形成一条 re-render 链。

2. 如何防止子组件 re-render
- 子组件自身被缓存。
- 子组件所有的 prop 都被缓存。

3.  如何判断子组件需要缓存
- 人肉判断，开发或者测试人员在研发过程中感知到渲染性能问题，并进行判断。
- 通过工具，目前有一些工具协助开发者在查看组件性能:
  如 React Dev Tools Profiler，这篇文章介绍了使用方式
  如这个 hooks：useRenderTimes

4. 为什么 React 没有把缓存组件作为默认配置？
- 缓存是有成本的，小的成本可能会累加过高。
- 默认缓存无法保证足够的正确性。

5. useMemo/useCallback 使用准则了
- 大部分的 useMemo 和 useCallback 都应该移除，他们可能没有带来任何性能上的优化，反而增加了程序首次渲染的负担，并增加程序的复杂性。
- 使用 useMemo 和 useCallback 优化子组件 re-render 时，必须同时满足以下条件才有效。
  子组件已通过 React.memo 或 useMemo 被缓存
  子组件所有的 prop 都被缓存
- 不推荐默认给所有组件都使用缓存，大量组件初始化时被缓存，可能导致过多的内存消耗，并影响程序初始化渲染的速度