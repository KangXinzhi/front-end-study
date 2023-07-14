<a name="AuLS6"></a>
## React
<a name="top6C"></a>
### 对于React 框架的理解（React的特性有哪些）
React是一个用于构建用户界面的 JavaScript 库，只提供了 UI 层面的解决方案。<br />它有以下特性：

- 组件化：将界面成了各个独立的小块，每一个块就是组件，这些组件之间可以组合、嵌套，构成整体页面，提高代码的复用率和开发效率。
- 数据驱动视图：
   - React通过setState实现数据驱动视图，通过setState来引发一次组件的更新过程从而实现页面的重新渲染。
   - 数据驱动视图是我们只需要关注数据的变化，不用再去操作dom。同时也提升了性能。
- JSX 语法：用于声明组件结构，是一个 JavaScript 的语法扩展。
- 单向数据绑定：从高阶组件到低阶组件的单向数据流，单向响应的数据流会比双向绑定的更安全，速度更快
- 虚拟 DOM：使用虚拟 DOM 来有效地操作 DOM
- 声明式编程:如实现一个标记的地图： 通过命令式创建地图、创建标记、以及在地图上添加的标记的步骤如下：
```
// 创建地图
const map = new Map.map(document.getElementById("map"), {
  zoom: 4,
  center: { lat, lng },
});

// 创建标记
const marker = new Map.marker({
  position: { lat, lng },
  title: "Hello Marker",
});

// 地图上添加标记
marker.setMap(map);
```
而用 React 实现上述功能则如下：声明式编程方式使得 React 组件很容易使用，最终的代码简单易于维护
```
<Map zoom={4} center={(lat, lng)}>
  <Marker position={(lat, lng)} title={"Hello Marker"} />
</Map>
```
声明式编程方式使得 React 组件很容易使用，最终的代码简单易于维护

<a name="IARUy"></a>
### jsx语法是必须的吗
以下是经过babel转译之后的jsx：
```
// jsx
const element = <h1>Hello, world!</h1>;
const container = document.getElementById(
  'root'
);
ReactDOM.render(element, container);

// babel 处理后
const element = /*#__PURE__*/React.createElement("h1", null, "Hello, world!");
const container = document.getElementById('root');
ReactDOM.render(element, container);
```
_注：React.createElement(标签名，属性对象，子元素)_<br />所以不使用jsx语法也可以使用React：<br />两者均可正常显示，但是两者的优劣显而易见，使用createElement方法会使代码更加的冗余，而jsx更加简洁。

<a name="YG9pe"></a>
### 虚拟dom
![image.png](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689327303771-06d19770-2906-4657-b845-839a57f5fff4.png#averageHue=%23f5f5f5&clientId=ufbd977c4-3c51-4&from=paste&height=334&id=ubffa04f6&originHeight=418&originWidth=633&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=15146&status=done&style=none&taskId=u7cf6f5e1-6d14-4b21-88e6-0351dc7d1c4&title=&width=506.4)<br />很多人认为虚拟 DOM 最大的优势是 diff 算法，减少 JavaScript 操作真实 DOM 的带来的性能消耗。虽然这一个虚拟 DOM 带来的一个优势，但并不是全部。虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种GUI。<br />虚拟 DOM 就是一个普通的 JavaScript 对象，包含了 tag、props、children 三个属性。
```
<div id="app">
  <p class="text">hello world!!!</p>
</div>
```

观察主流的虚拟 DOM 库（[snabbdom](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsnabbdom%2Fsnabbdom)、[virtual-dom](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMatt-Esch%2Fvirtual-dom)），通常都有一个 h 函数，也就是 React 中的 React.createElement，以及 Vue 中的 render 方法中的 createElement，另外 React 是通过 babel 将 jsx 转换为 h 函数渲染的形式，而 Vue 是使用 vue-loader 将模版转为 h 函数渲染的形式（也可以通过 babel-plugin-transform-vue-jsx 插件在 vue 中使用 jsx，本质还是转换为 h 函数渲染形式）。

**虚拟DOM**在React中有个正式的称呼——Fiber

<a name="o4e3T"></a>
### JSX 和 ReactElement
相信大家最初学 React 的时候都有这样的疑问，为什么我们能够以类似 HTML 的语法编写组件，这个东西又是怎么转换成 JavaScript 语法的？答案就是 Babel。根据官网介绍，这种语法被称为 JSX，是一个 JavaScript 的语法扩展。能够被 Babel 编译成 React.createElement 方法。举个例子：<br />![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689315731199-defc29bb-ad04-47aa-964d-9c37dbe4b025.png#averageHue=%232e2d2c&clientId=ufbd977c4-3c51-4&from=paste&id=u6a2cd1d2&originHeight=282&originWidth=1080&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u30706a1b-192d-458c-8d65-e082f10103e&title=)<br />通过查阅源码我们可以看到 **「React.createElement」** 方法
```javascript
export function createElement(type, config, children) {
  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;
  ...
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };
  ...
  return element;
}
```
可以看到 React 是使用了 element 这种结构来代表一个节点，里面就只有简单的 6 个字段。我们可以看个实际的例子，下面 Count 组件对应的 element 数据结构：
```javascript
function Count({count, onCountClick}) {
  return <div onClick={() => { onCountClick()}}>
  count: {count}
  </div>
}

<Count />
```
![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689315731228-8bf04190-fc54-4676-a352-54648d94905a.png#averageHue=%23232327&clientId=ufbd977c4-3c51-4&from=paste&id=u3020216f&originHeight=302&originWidth=1080&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u443caafc-07f0-4e60-a595-7336d62db5e&title=)<br />可以看到，element 结构只能反映出 jsx 节点的层级结构，而组件里的各种状态或者返回 jsx 等都是不会记录在 element 中。<br />目前我们知道，我们编写的 jsx 会首先被处理成 element 结构。<br />jsx -> element<br />那 React 又是如何处理 element 的，如刚刚说的，element 里包含的信息太少，只靠 element 显然是不足以映射到所有真实 DOM 的，因此我们还需要更精细的结构。

我们编写的 jsx 首先会形成 element ，然后在 render 过程中每个 element 都会生成对应的 Fiber，最终形成 Fiber 树。<br />jsx -> element -> Fiber

<a name="Jsh5Y"></a>
### React理念
我们可以从[官网(opens new window)](https://zh-hans.reactjs.org/docs/thinking-in-react.html)看到React的理念：<br />我们认为，React 是用 JavaScript 构建**快速响应**的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。<br />可见，关键是实现快速响应。那么制约快速响应的因素是什么呢？<br />我们日常使用App，浏览网页时，有两类场景会制约快速响应：

- 当遇到大计算量的操作或者设备性能不足使页面掉帧，导致卡顿。
- 发送网络请求后，由于需要等待数据返回才能进一步操作导致不能快速响应。

这两类场景可以概括为：

- CPU的瓶颈
- IO的瓶颈

React是如何解决这两个瓶颈的呢？
<a name="kTR6f"></a>
#### CPU的瓶颈
当项目变得庞大、组件数量繁多时，就容易遇到CPU的瓶颈。<br />考虑如下Demo，我们向视图中渲染3000个li：

```
function App() {
  const len = 3000;
  return (
    <ul>
      {Array(len).fill(0).map((_, i) => <li>{i}</li>)}
    </ul>
  );
}

const rootEl = document.querySelector("#root");
ReactDOM.render(<App/>, rootEl);
```
主流浏览器刷新频率为60Hz，即每（1000ms / 60Hz）16.6ms浏览器刷新一次。<br />我们知道，JS可以操作DOM，GUI渲染线程与JS线程是互斥的。所以**JS脚本执行**和**浏览器布局、绘制**不能同时执行。<br />在每16.6ms时间内，需要完成如下工作：

```
JS脚本执行 -----  样式布局 ----- 样式绘制
```
当JS执行时间过长，超出了16.6ms，这次刷新就没有时间执行**样式布局**和**样式绘制**了。<br />在Demo中，由于组件数量繁多（3000个），JS脚本执行时间过长，页面掉帧，造成卡顿。<br />可以从打印的执行堆栈图看到，JS执行时间为73.65ms，远远多于一帧的时间。

如何解决这个问题呢？<br />答案是：在浏览器每一帧的时间中，预留一些时间给JS线程，React利用这部分时间更新组件（可以看到，在[源码(opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L119)中，预留的初始时间是5ms）。<br />当预留的时间不够用时，React将线程控制权交还给浏览器使其有时间渲染UI，React则等待下一帧时间到来继续被中断的工作。<br />这种将长任务分拆到每一帧中，像蚂蚁搬家一样一次执行一小段任务的操作，被称为时间切片（time slice）<br />接下来我们开启Concurrent Mode（后续章节会讲到，当前你只需了解开启后会启用时间切片）：

 

```
// 通过使用ReactDOM.unstable_createRoot开启Concurrent Mode
// ReactDOM.render(<App/>, rootEl);  
ReactDOM.unstable_createRoot(rootEl).render(<App/>);
```
此时我们的长任务被拆分到每一帧不同的task中，JS脚本执行时间大体在5ms左右，这样浏览器就有剩余时间执行**样式布局**和**样式绘制**，减少掉帧的可能性。<br />![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689316683473-5166ce2e-fa59-43a4-b6f0-af70e1f19e16.png#averageHue=%23acdbbf&clientId=ufbd977c4-3c51-4&from=paste&id=u98b35219&originHeight=535&originWidth=1425&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u7c373698-eaa4-47de-bdca-d067b148454&title=)<br />所以，解决CPU瓶颈的关键是实现时间切片，而时间切片的关键是：将**同步的更新**变为**可中断的异步更新**。<br />同步更新 vs 异步更新 Demo
<a name="qZYVG"></a>
#### IO的瓶颈
网络延迟是前端开发者无法解决的。如何在网络延迟客观存在的情况下，减少用户对网络延迟的感知？<br />React给出的答案是[将人机交互研究的结果整合到真实的 UI 中(opens new window)](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html#putting-research-into-production)。<br />这里我们以业界人机交互最顶尖的苹果举例，在IOS系统中：<br />点击“设置”面板中的“通用”，进入“通用”界面：<br />![](https://cdn.nlark.com/yuque/0/2023/gif/12536841/1689316675571-3ed06a41-389c-4329-a605-e8a29bbfe958.gif#averageHue=%23a0a137&clientId=ufbd977c4-3c51-4&from=paste&id=uc0efb7a3&originHeight=480&originWidth=640&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=ud2e01e9d-f569-454c-b6e9-f79e076684a&title=)<br />作为对比，再点击“设置”面板中的“Siri与搜索”，进入“Siri与搜索”界面：<br />![](https://cdn.nlark.com/yuque/0/2023/gif/12536841/1689316675558-a1df9767-b6ca-4ef8-9c80-5a6d209396b6.gif#averageHue=%23a1a538&clientId=ufbd977c4-3c51-4&from=paste&id=uf8a579dc&originHeight=480&originWidth=640&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u669d691e-a335-49ab-873c-6f50b07e6db&title=)<br />你能感受到两者体验上的区别么？<br />事实上，点击“通用”后的交互是同步的，直接显示后续界面。而点击“Siri与搜索”后的交互是异步的，需要等待请求返回后再显示后续界面。但从用户感知来看，这两者的区别微乎其微。<br />这里的窍门在于：点击“Siri与搜索”后，先在当前页面停留了一小段时间，这一小段时间被用来请求数据。<br />当“这一小段时间”足够短时，用户是无感知的。如果请求时间超过一个范围，再显示loading的效果。<br />试想如果我们一点击“Siri与搜索”就显示loading效果，即使数据请求时间很短，loading效果一闪而过。用户也是可以感知到的。<br />为此，React实现了[Suspense(opens new window)](https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html)功能及配套的hook——[useDeferredValue(opens new window)](https://zh-hans.reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue)。<br />而在源码内部，为了支持这些特性，同样需要将**同步的更新**变为**可中断的异步更新**。
<a name="hEmGr"></a>
#### 总结
通过以上内容，我们可以看到，React为了践行“构建**快速响应**的大型 Web 应用程序”理念做出的努力。<br />其中的关键是解决CPU的瓶颈与IO的瓶颈。而落实到实现上，则需要将**同步的更新**变为**可中断的异步更新**。
<a name="ZqoeS"></a>
### 老的React架构
在上一节中我们了解了React的理念，简单概括就是**快速响应**。<br />React从v15升级到v16后重构了整个架构。本节我们聊聊v15，看看他为什么不能满足**快速响应**的理念，以至于被重构。
<a name="gZ2qV"></a>
#### React15架构
React15架构可以分为两层：

- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上
<a name="x25mN"></a>
##### Reconciler（协调器）
我们知道，在React中可以通过this.setState、this.forceUpdate、ReactDOM.render等API触发更新。<br />每当有更新发生时，**Reconciler**会做如下工作：

- 调用函数组件、或class组件的render方法，将返回的JSX转化为虚拟DOM
- 将虚拟DOM和上次更新时的虚拟DOM对比
- 通过对比找出本次更新中变化的虚拟DOM
- 通知**Renderer**将变化的虚拟DOM渲染到页面上

你可以在[这里(opens new window)](https://zh-hans.reactjs.org/docs/codebase-overview.html#reconcilers)看到React官方对**Reconciler**的解释
<a name="zcg7E"></a>
##### Renderer（渲染器）
由于React支持跨平台，所以不同平台有不同的**Renderer**。我们前端最熟悉的是负责在浏览器环境渲染的**Renderer** —— [ReactDOM(opens new window)](https://www.npmjs.com/package/react-dom)。<br />除此之外，还有：

- [ReactNative(opens new window)](https://www.npmjs.com/package/react-native)渲染器，渲染App原生组件
- [ReactTest(opens new window)](https://www.npmjs.com/package/react-test-renderer)渲染器，渲染出纯Js对象用于测试
- [ReactArt(opens new window)](https://www.npmjs.com/package/react-art)渲染器，渲染到Canvas, SVG 或 VML (IE8)

在每次更新发生时，**Renderer**接到**Reconciler**通知，将变化的组件渲染在当前宿主环境。<br />你可以在[这里(opens new window)](https://zh-hans.reactjs.org/docs/codebase-overview.html#renderers)看到React官方对**Renderer**的解释
<a name="JpsoN"></a>
#### React15架构的缺点
在**Reconciler**中，mount的组件会调用[mountComponent(opens new window)](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L498)，update的组件会调用[updateComponent(opens new window)](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L877)。这两个方法都会递归更新子组件。
<a name="bscAd"></a>
##### 递归更新的缺点
由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了16ms，用户交互就会卡顿。<br />在上一节中，我们已经提出了解决办法——用**可中断的异步更新**代替**同步的更新**。那么React15的架构支持异步更新么？让我们看一个例子：<br />乘法小Demo<br />我用红色标注了更新的步骤。 ![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689316810994-8e1c34e5-5f11-4779-968c-a69fd6ea07c4.png#averageHue=%23fcfbfa&clientId=ufbd977c4-3c51-4&from=paste&id=ucf4fe181&originHeight=804&originWidth=1750&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u87b42c99-0b10-47b4-8511-2e425a2c0ef&title=)<br />我们可以看到，**Reconciler**和**Renderer**是交替工作的，当第一个li在页面上已经变化后，第二个li再进入**Reconciler**。<br />由于整个过程都是同步的，所以在用户看来所有DOM是同时更新的。<br />接下来，让我们模拟一下，如果中途中断更新会怎么样？<br />**注意**<br />以下是我们模拟中断的情况，实际上React15并不会中断进行中的更新<br />![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689316810906-f90e8dec-511e-48c9-ae1e-f066fd47a005.png#averageHue=%23f9f9f9&clientId=ufbd977c4-3c51-4&from=paste&id=u42ae85d8&originHeight=732&originWidth=1698&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u05f13293-ff7f-41cc-ada4-d168cbc6c61&title=)<br />当第一个li完成更新时中断更新，即步骤3完成后中断更新，此时后面的步骤都还未执行。<br />用户本来期望123变为246。实际却看见更新不完全的DOM！（即223）<br />基于这个原因，React决定重写整个架构。
<a name="sPxIn"></a>
### React16架构
React16架构可以分为三层：

- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入**Reconciler**
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

可以看到，相较于React15，React16中新增了**Scheduler（调度器）**，让我们来了解下他。
<a name="pgvEX"></a>
#### Scheduler（调度器）
既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间时通知我们。<br />其实部分浏览器已经实现了这个API，这就是[requestIdleCallback(opens new window)](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)。但是由于以下因素，React放弃使用：

- 浏览器兼容性
- 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换tab后，之前tab注册的requestIdleCallback触发的频率会变得很低

基于以上原因，React实现了功能更完备的requestIdleCallbackpolyfill，这就是**Scheduler**。除了在空闲时触发回调的功能外，**Scheduler**还提供了多种调度优先级供任务设置。<br />[Scheduler(opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/README.md)是独立于React的库
<a name="gqJSA"></a>
#### Reconciler（协调器）
我们知道，在React15中**Reconciler**是递归处理虚拟DOM的。让我们看看[React16的Reconciler(opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1673)。<br />我们可以看见，更新工作从递归变成了可以中断的循环过程。每次循环都会调用shouldYield判断当前是否有剩余时间。

```
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```
那么React16是如何解决中断更新时DOM渲染不完全的问题呢？<br />在React16中，**Reconciler**与**Renderer**不再是交替工作。当**Scheduler**将任务交给**Reconciler**后，**Reconciler**会为变化的虚拟DOM打上代表增/删/更新的标记，类似这样：

```
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```
全部的标记见[这里(opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)<br />整个**Scheduler**与**Reconciler**的工作都在内存中进行。只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**。<br />你可以在[这里(opens new window)](https://zh-hans.reactjs.org/docs/codebase-overview.html#fiber-reconciler)看到React官方对React16新**Reconciler**的解释
<a name="JYLjf"></a>
#### Renderer（渲染器）
**Renderer**根据**Reconciler**为虚拟DOM打的标记，同步执行对应的DOM操作。<br />所以，对于我们在上一节使用过的Demo<br />乘法小Demo<br />在React16架构中整个更新流程为：<br />![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689316984845-3ec2bc90-dc16-429d-84a2-570dc9a5d574.png#averageHue=%23f7f7f7&clientId=ufbd977c4-3c51-4&from=paste&id=u52bf8535&originHeight=986&originWidth=2290&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=ua961db4b-e76c-4212-91a0-171ec3a6d58&title=)<br />其中红框中的步骤随时可能由于以下原因被中断：

- 有其他更高优任务需要先更新
- 当前帧没有剩余时间

由于红框中的工作都在内存中进行，不会更新页面上的DOM，所以即使反复中断，用户也不会看见更新不完全的DOM（即上一节演示的情况）。<br />实际上，由于**Scheduler**和**Reconciler**都是平台无关的，所以React为他们单独发了一个包[react-Reconciler(opens new window)](https://www.npmjs.com/package/react-reconciler)。你可以用这个包自己实现一个ReactDOM，具体见**参考资料**
<a name="l43Dq"></a>
#### 总结
通过本节我们知道了React16采用新的Reconciler。<br />Reconciler内部采用了Fiber的架构。<br />Fiber是什么？他和Reconciler或者说和React之间是什么关系？我们会在接下来三节解答。
<a name="X6hmw"></a>
### Fiber架构的心智模型
<a name="OQxfy"></a>
#### 什么是代数效应
代数效应是函数式编程中的一个概念，用于将副作用从函数调用中分离。
<a name="pF6f4"></a>
#### 代数效应在React中的应用
那么代数效应与React有什么关系呢？最明显的例子就是Hooks。<br />对于类似useState、useReducer、useRef这样的Hook，我们不需要关注FunctionComponent的state在Hook中是如何保存的，React会为我们处理。<br />我们只需要假设useState返回的是我们想要的state，并编写业务逻辑就行。
<a name="JMjL9"></a>
#### 代数效应与Generator
从React15到React16，协调器（Reconciler）重构的一大目的是：将老的同步更新的架构变为异步可中断更新。<br />异步可中断更新可以理解为：更新在执行过程中可能会被打断（浏览器时间分片用尽或有更高优任务插队），当可以继续执行时恢复之前执行的中间状态。<br />这就是代数效应中try...handle的作用。<br />其实，浏览器原生就支持类似的实现，这就是Generator。<br />但是Generator的一些缺陷使React团队放弃了他：

- 类似async，Generator也是传染性的，使用了Generator则上下文的其他函数也需要作出改变。这样心智负担比较重。
- Generator执行的中间状态是上下文关联的。
<a name="N2quu"></a>
### Fiber架构的实现原理
<a name="glYIb"></a>
#### Fiber的起源
最早的Fiber官方解释来源于[2016年React团队成员Acdlite的一篇介绍(opens new window)](https://github.com/acdlite/react-fiber-architecture)。<br />从上一章的学习我们知道：<br />在React15及以前，Reconciler采用递归的方式创建虚拟DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。<br />为了解决这个问题，React16将**递归的无法中断的更新**重构为**异步的可中断更新**，由于曾经用于递归的**虚拟DOM**数据结构已经无法满足需要。于是，全新的Fiber架构应运而生。
<a name="Jlbpg"></a>
#### Fiber的含义
Fiber包含三层含义：

1. 作为架构来说，之前React15的Reconciler采用递归的方式执行，数据保存在递归调用栈中，所以被称为stack Reconciler。React16的Reconciler基于Fiber节点实现，被称为Fiber Reconciler。
2. 作为静态的数据结构来说，每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
3. 作为动态的工作单元来说，每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。
<a name="rgB6O"></a>
#### Fiber的结构
你可以从这里看到[Fiber节点的属性定义(opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117)。虽然属性很多，但我们可以按三层含义将他们分类来看

```
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```
<a name="vBgSx"></a>
#### 作为架构来说
每个Fiber节点有个对应的React element，多个Fiber节点是如何连接形成树呢？靠如下三个属性：

```
// 指向父级Fiber节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```
举个例子，如下的组件结构：

```
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  )
}
```
对应的Fiber树结构： ![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689320114722-2b01b549-c49c-4f42-8e92-75e35da7a5e5.png#averageHue=%23fdfdfd&clientId=ufbd977c4-3c51-4&from=paste&id=u89a12d86&originHeight=1338&originWidth=1618&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=ue9534e71-528c-4224-98b4-90e5294f871&title=)<br />这里需要提一下，为什么父级指针叫做return而不是parent或者father呢？因为作为一个工作单元，return指节点执行完completeWork（本章后面会介绍）后会返回的下一个节点。子Fiber节点及其兄弟节点完成工作后会返回其父级节点，所以用return指代父级节点。<br />**作为静态的数据结构**<br />作为一种静态的数据结构，保存了组件相关的信息：

```
// Fiber对应组件的类型 Function/Class/Host...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```


**作为动态的工作单元**<br />作为动态的工作单元，Fiber中如下参数保存了本次更新相关的信息，我们会在后续的更新流程中使用到具体属性时再详细介绍

```
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```
如下两个字段保存调度优先级相关的信息，会在讲解Scheduler时介绍。

```
// 调度优先级相关
this.lanes = NoLanes;
this.childLanes = NoLanes;
```
**注意**<br />在2020年5月，调度优先级策略经历了比较大的重构。以expirationTime属性为代表的优先级模型被lane取代。详见[这个PR(opens new window)](https://github.com/facebook/react/pull/18796)<br />如果你的源码中fiber.expirationTime仍存在，请参照[调试源码](https://react.iamkasong.com/preparation/source.html)章节获取最新代码。
<a name="XYL2U"></a>
#### 总结
本节我们了解了Fiber的起源与架构，其中Fiber节点可以构成Fiber树。那么Fiber树和页面呈现的DOM树有什么关系，React又是如何更新DOM的呢
<a name="mYxGl"></a>
### Fiber架构的工作原理
<a name="dSNd3"></a>
#### 什么是“双缓存”
当我们用canvas绘制动画，每一帧绘制前都会调用ctx.clearRect清除上一帧的画面。<br />如果当前帧画面计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。<br />为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。<br />这种**在内存中构建并直接替换**的技术叫做[双缓存(opens new window)](https://baike.baidu.com/item/%E5%8F%8C%E7%BC%93%E5%86%B2)。<br />React使用“双缓存”来完成Fiber树的构建与替换——对应着DOM树的创建与更新。
<a name="Aix9X"></a>
#### 双缓存Fiber树
在React中最多会同时存在两棵Fiber树。当前屏幕上显示内容对应的Fiber树称为current Fiber树，正在内存中构建的Fiber树称为workInProgress Fiber树。<br />current Fiber树中的Fiber节点被称为current fiber，workInProgress Fiber树中的Fiber节点被称为workInProgress fiber，他们通过alternate属性连接。

```
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```
React应用的根节点通过使current指针在不同Fiber树的rootFiber间切换来完成current Fiber树指向的切换。<br />即当workInProgress Fiber树构建完成交给Renderer渲染在页面上后，应用根节点的current指针指向workInProgress Fiber树，此时workInProgress Fiber树就变为current Fiber树。<br />每次状态更新都会产生新的workInProgress Fiber树，通过current与workInProgress的替换，完成DOM更新。<br />接下来我们以具体例子讲解mount时、update时的构建/替换流程。
<a name="u00gC"></a>
#### mount时
考虑如下例子：

```
function App() {
  const [num, add] = useState(0);
  return (
    <p onClick={() => add(num + 1)}>{num}</p>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

1. 首次执行ReactDOM.render会创建fiberRootNode（源码中叫fiberRoot）和rootFiber。其中fiberRootNode是整个应用的根节点，rootFiber是<App/>所在组件树的根节点。

之所以要区分fiberRootNode与rootFiber，是因为在应用中我们可以多次调用ReactDOM.render渲染不同的组件树，他们会拥有不同的rootFiber。但是整个应用的根节点只有一个，那就是fiberRootNode。<br />fiberRootNode的current会指向当前页面上已渲染内容对应Fiber树，即current Fiber树。<br />![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689320284560-3a53631d-7936-4055-9657-80c9129a88b5.png#averageHue=%23fcfcfc&clientId=ufbd977c4-3c51-4&from=paste&id=ub0b4ef65&originHeight=380&originWidth=659&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=ua143a92a-bb96-429f-a691-e0b28ebb321&title=)

```
fiberRootNode.current = rootFiber;
```
由于是首屏渲染，页面中还没有挂载任何DOM，所以fiberRootNode.current指向的rootFiber没有任何子Fiber节点（即current Fiber树为空）。

1. 接下来进入render阶段，根据组件返回的JSX在内存中依次创建Fiber节点并连接在一起构建Fiber树，被称为workInProgress Fiber树。（下图中右侧为内存中构建的树，左侧为页面显示的树）

在构建workInProgress Fiber树时会尝试复用current Fiber树中已有的Fiber节点内的属性，在首屏渲染时只有rootFiber存在对应的current fiber（即rootFiber.alternate）。<br />![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689320284651-83a54013-e06e-4b71-9dbf-62c5f8eab926.png#averageHue=%23fdfdfd&clientId=ufbd977c4-3c51-4&from=paste&id=uec3e5b3e&originHeight=879&originWidth=706&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=ue59f8de0-ae5f-427d-a6dc-29204434c0f&title=)

1. 图中右侧已构建完的workInProgress Fiber树在commit阶段渲染到页面。

此时DOM更新为右侧树对应的样子。fiberRootNode的current指针指向workInProgress Fiber树使其变为current Fiber 树。<br />![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689320284644-18ac4674-6f1e-437b-aab1-e3f305d3511b.png#averageHue=%23fdfdfd&clientId=ufbd977c4-3c51-4&from=paste&id=u76b1e18a&originHeight=890&originWidth=646&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u58c7695c-690c-4516-90eb-e4b99e34004&title=)
<a name="ePTCt"></a>
#### update时

1. 接下来我们点击p节点触发状态改变，这会开启一次新的render阶段并构建一棵新的workInProgress Fiber 树。

![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689320284753-a76f7cc1-fd74-4bda-aa4a-5856abafbb60.png#averageHue=%23fcfcfc&clientId=ufbd977c4-3c51-4&from=paste&id=uccf5ebbf&originHeight=890&originWidth=716&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u6b1a8de1-787e-49ce-bf6f-44699c58e2b&title=)<br />和mount时一样，workInProgress fiber的创建可以复用current Fiber树对应的节点数据。<br />这个决定是否复用的过程就是Diff算法，后面章节会详细讲解

1. workInProgress Fiber 树在render阶段完成构建后进入commit阶段渲染到页面上。渲染完毕后，workInProgress Fiber 树变为current Fiber 树。

![](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689320284752-205f9788-3a68-418a-9eac-aa6b552c077d.png#averageHue=%23fdfdfd&clientId=ufbd977c4-3c51-4&from=paste&id=u718b67a4&originHeight=898&originWidth=674&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u76038ea0-1454-47d5-8410-dc2290778cb&title=)

<a name="Bq2Sg"></a>
### React技术揭秘
[架构篇](https://react.iamkasong.com/process/reconciler.html#%E9%80%92-%E9%98%B6%E6%AE%B5)<br />[实现篇](https://react.iamkasong.com/diff/prepare.html)
<a name="wIRbX"></a>
### REACT.setState是同步还是异步

- react18之前。<br />setState在不同情况下可以表现为异步或同步。<br />在Promise的状态更新、js原生事件、setTimeout、setInterval..中是同步的。<br />在react的合成事件中，是异步的。 
-  react18之后。<br />setState都会表现为异步（即批处理）。 

react18之前版本的解释<br />在React中，如果是由React引发的事件处理（比如通过onClick引发的事件处理），调用setState不会同步更新this.state，除此之外的setState调用会同步执行this.state 。所谓“除此之外”，指的是绕过React通过addEventListener直接添加的事件处理函数，还有通过setTimeout/setInterval产生的异步调用。<br />原因： 在React的setState函数实现中，会根据一个变量isBatchingUpdates判断是直接更新this.state还是放到队列中回头再说，而isBatchingUpdates默认是false，也就表示setState会同步更新this.state，但是，有一个函数batchedUpdates，这个函数会把isBatchingUpdates修改为true，而当React在调用事件处理函数之前就会调用这个batchedUpdates，造成的后果，就是由React控制的事件处理过程setState不会同步更新this.state。<br />注意： setState的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。<br />综上，setState 只在合成事件和 hook() 中是“异步”的，在 原生事件和 setTimeout 中都是同步的。
<a name="hnyJd"></a>
### useLayoutEffect
一般将useLayoutEffect称为有DOM操作的副作用hooks。作用是在DOM更新完成之后执行某个操作。执行时机：在DOM更新之后执行<br />与useEffect对比<br />相同点<br />1.第一个参数，接收一个函数作为参数<br />2.第二个参数，接收【依赖列表】，只有依赖更新时，才会执行函数<br />3.返回一个函数，先执行返回函数，再执行参数函数<br />（所以说执行过程的流程是一样的）<br />不同点<br />执行时机不同。useLayoutEffect在DOM更新之后执行；useEffect在render渲染结束后执行。执行示例代码会发现useLayoutEffect永远比useEffect先执行，这是因为DOM更新之后，渲染才结束或者渲染还会结束<br />共同点  <br />运用效果： useEffect 与 useLayoutEffect 两者都是用于处理副作用，这些副作用包括改变 DOM、设置订阅、操作定时器等。在函数组件内部操作副作用是不被允许的，所以需要使用这两个函数去处理。  <br />使用方式： useEffect 与 useLayoutEffect 两者底层的函数签名是完全一致的，都是调用的 mountEffectImpl方法，在使用上也没什么差异，基本可以直接替换。  <br />不同点  <br />使用场景： useEffect 在 React 的渲染过程中是被异步调用的，用于绝大多数场景；而 useLayoutEffect 会在所有的 DOM 变更之后同步调用，主要用于处理 DOM 操作、调整样式、避免页面闪烁等问题。也正因为是同步处理，所以需要避免在 useLayoutEffect 做计算量较大的耗时任务从而造成阻塞。  <br />使用效果： useEffect是按照顺序执行代码的，改变屏幕像素之后执行（先渲染，后改变DOM），当改变屏幕内容时可能会产生闪烁；useLayoutEffect是改变屏幕像素之前就执行了（会推迟页面显示的事件，先改变DOM后渲染），不会产生闪烁。useLayoutEffect总是比useEffect先执行。  <br />在未来的趋势上，两个 API 是会长期共存的，暂时没有删减合并的计划，需要开发者根据场景去自行选择。React 团队的建议非常实用，如果实在分不清，先用 useEffect，一般问题不大；如果页面有异常，再直接替换为 useLayoutEffect 即可。
<a name="YncGu"></a>
### useMemo和useCallback

1. 组件什么时候会 re-render
- 当本身的 props 或 state 改变时。
- Context value 改变时，使用该值的组件会 re-render。
- 当父组件重新渲染时，它所有的子组件都会 re-render，形成一条 re-render 链。
2. 如何防止子组件 re-render
- 子组件自身被缓存。
- 子组件所有的 prop 都被缓存。
3. 如何判断子组件需要缓存
- 人肉判断，开发或者测试人员在研发过程中感知到渲染性能问题，并进行判断。
- 通过工具，目前有一些工具协助开发者在查看组件性能:<br />如 React Dev Tools Profiler，这篇文章介绍了使用方式<br />如这个 hooks：useRenderTimes
4. 为什么 React 没有把缓存组件作为默认配置？
- 缓存是有成本的，小的成本可能会累加过高。
- 默认缓存无法保证足够的正确性。
5. useMemo/useCallback 使用准则了
- 大部分的 useMemo 和 useCallback 都应该移除，他们可能没有带来任何性能上的优化，反而增加了程序首次渲染的负担，并增加程序的复杂性。
- 使用 useMemo 和 useCallback 优化子组件 re-render 时，必须同时满足以下条件才有效。<br />子组件已通过 React.memo 或 useMemo 被缓存<br />子组件所有的 prop 都被缓存
- 不推荐默认给所有组件都使用缓存，大量组件初始化时被缓存，可能导致过多的内存消耗，并影响程序初始化渲染的速度
<a name="OHAER"></a>
### React18有哪些更新？
[https://juejin.cn/post/7094037148088664078?searchId=20230714170037D196B330C19FBC321059#heading-26](https://juejin.cn/post/7094037148088664078?searchId=20230714170037D196B330C19FBC321059#heading-26)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689324673284-38864239-3cfb-4fc1-9f18-d01a05915359.png#averageHue=%23fbfbfb&clientId=ufbd977c4-3c51-4&from=paste&height=470&id=ucdfe1622&originHeight=587&originWidth=910&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=15734&status=done&style=none&taskId=ud5a4ccd4-b5c4-4d72-b58b-3e25f2d60c2&title=&width=728)

1. setState自动批处理

在react17中，只有react事件会进行批处理，原生js事件、promise，setTimeout、setInterval不会<br />react18，将所有事件都进行批处理，即多次setState会被合并为1次执行，提高了性能，在数据层，将多个状态更新合并成一次处理（在视图层，将多次渲染合并成一次渲染）

2. 引入了新的root API，支持new concurrent renderer(并发模式的渲染)
```
javascript
复制代码//React 17
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

const root = document.getElementById("root")
ReactDOM.render(<App/>,root)

// 卸载组件
ReactDOM.unmountComponentAtNode(root)  

// React 18
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
const root = document.getElementById("root")
ReactDOM.createRoot(root).render(<App/>)

// 卸载组件
root.unmount()
```

3. 去掉了对IE浏览器的支持，react18引入的新特性全部基于现代浏览器，如需支持需要退回到react17版本
4. flushSync

批量更新是一个破坏性的更新，如果想退出批量更新，可以使用flushSync

5. react组件返回值更新
- 在react17中，返回空组件只能返回null，显式返回undefined会报错
- 在react18中，支持null和undefined返回
6. strict mode更新

当你使用严格模式时，React会对每个组件返回两次渲染，以便你观察一些意想不到的结果,在react17中去掉了一次渲染的控制台日志，以便让日志容易阅读。react18取消了这个限制，第二次渲染会以浅灰色出现在控制台日志

7. Suspense不再需要fallback捕获
8. 支持useId

在服务器和客户端生成相同的唯一一个id，避免hydrating的不兼容

9. useSyncExternalStore

用于解决外部数据撕裂问题

10. useInsertionEffect

这个hooks只建议在css in js库中使用，这个hooks执行时机在DOM生成之后，useLayoutEffect执行之前，它的工作原理大致与useLayoutEffect相同，此时无法访问DOM节点的引用，一般用于提前注入脚本 

11. **Concurrent Mode**

并发模式不是一个功能，而是一个底层设计。<br />它可以帮助应用保持响应，根据用户的设备性能和网速进行调整，它通过渲染可中断来修复阻塞渲染机制。在**concurrent模式**中，React可以同时更新多个状态<br />区别就是使**同步不可中断更新**变成了**异步可中断更新**<br />useDeferredValue和startTransition用来标记一次非紧急更新
<a name="OwR8D"></a>
### React事件机制
**什么是合成事件**<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689328287358-f26bbd1e-d6e6-46d3-adb4-b758ea691538.png#averageHue=%23f7f7f7&clientId=ufbd977c4-3c51-4&from=paste&height=112&id=u5d5689c8&originHeight=140&originWidth=628&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=4871&status=done&style=none&taskId=u1f302888-d542-4054-841c-704bdb306f5&title=&width=502.4)<br />**React基于浏览器的事件机制实现了一套自身的事件机制，它符合W3C规范，包括事件触发、事件冒泡、事件捕获、事件合成和事件派发等**<br />React事件的设计动机(作用)：

- **在底层磨平不同浏览器的差异，React实现了统一的事件机制，我们不再需要处理浏览器事件机制方面的兼容问题，在上层面向开发者暴露稳定、统一的、与原生事件相同的事件接口**
- **React把握了事件机制的主动权，实现了对所有事件的中心化管控**
- **React引入事件池避免垃圾回收，在事件池中获取或释放事件对象，避免频繁的创建和销毁**

**React事件机制和原生DOM事件流有什么区别**<br />**虽然合成事件不是原生DOM事件，但它包含了原生DOM事件的引用，可以通过e.nativeEvent访问**

---

**DOM事件流是怎么工作的**，一个页面往往会绑定多个事件，页面接收事件的顺序叫事件流<br />W3C标准事件的传播过程：

1. 事件捕获
2. 处于目标
3. 事件冒泡

常用的事件处理性能优化手段：**事件委托**<br />**把多个子元素同一类型的监听函数合并到父元素上，通过一个函数监听的行为叫事件委托**<br />**我们写的React事件是绑定在DOM上吗，如果不是绑定在哪里**<br />React16的事件绑定在document上， React17以后事件绑定在container上,**ReactDOM.render(app,container)**<br />**React事件机制**总结如下：<br />事件绑定 事件触发

- **React所有的事件绑定在container上**(react17以后),而不是绑定在DOM元素上（作用：减少内存开销，所有的事件处理都在container上，其他节点没有绑定事件）
- React自身实现了一套冒泡机制，不能通过return false阻止冒泡
- React通过**SytheticEvent**实现了**事件合成**

![](https://cdn.nlark.com/yuque/0/2023/webp/12536841/1689327435118-d85bdfe6-0056-4ba4-802d-924de87db648.webp#averageHue=%232d2c36&clientId=ufbd977c4-3c51-4&from=paste&id=ub8203d01&originHeight=1054&originWidth=1740&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u2a2c2a78-ff8e-44b5-a10b-5b5807ee822&title=)<br />**React实现事件绑定的过程**<br />**1.建立合成事件与原生事件的对应关系**<br />**registrationNameModule,** 它建立了React事件到plugin的映射，它包含React支持的所有事件的类型，用于判断一个组件的prop是否是事件类型<br />**registrationNameDependencies，** 这个对象记录了React事件到原生事件的映射<br />**plugins对象,** 记录了所有注册的插件列表<br />**为什么针对同一个事件，即使可能存在多次回调，document（container）也只需要注册一次监听**<br />因为React注册到document(container)上的并不是一个某个DOM节点具体的回调逻辑，而是一个统一的事件分发函数dispatchEvent - > 事件委托思想<br />**dispatchEvent是怎么实现事件分发的**<br />事件触发的本质是对dispatchEvent函数的调用<br />![](https://cdn.nlark.com/yuque/0/2023/webp/12536841/1689327435193-0d48b303-0a2d-4077-b872-f846634862fb.webp#averageHue=%23e8e8e7&clientId=ufbd977c4-3c51-4&from=paste&id=ub8e41270&originHeight=821&originWidth=1188&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=ud34f79e3-98ce-4cd5-ac3f-1519370d852&title=)<br />**React事件处理为什么要手动绑定this**<br />react组件会被编译为React.createElement,在createElement中，它的this丢失了，并不是由组件实例调用的，因此需要手动绑定this<br />为什么不能通过return false阻止事件的默认行为<br />因为React基于浏览器的事件机制实现了一套自己的事件机制，和原生DOM事件不同，它采用了事件委托的思想，通过dispatch统一分发事件处理函数<br />**React怎么阻止事件冒泡**

- 阻止合成事件的冒泡用e.stopPropagation()
- 阻止合成事件和最外层document事件冒泡，使用e.nativeEvent.stopImmediatePropogation()
- 阻止合成事件和除了最外层document事件冒泡，通过判断e.target避免

HOC和hooks的区别<br />useEffect和useLayoutEffect区别<br />**React性能优化手段**

1. shouldComponentUpdate
2. memo
3. getDerviedStateFromProps
4. 使用Fragment
5. v-for使用正确的key
6. 拆分尽可能小的可复用组件，ErrorBoundary
7. 使用React.lazy和React.Suspense延迟加载不需要立马使用的组件
<a name="gh1NI"></a>
### 常用组件
**错误边界**<br />React部分组件的错误不应该导致整个应用崩溃，为了解决这个问题，React16引入了错误边界<br />使用方法：<br />React组件在内部定义了getDerivedStateFromError或者componentDidCatch，它就是一个错误边界。getDerviedStateFromError和componentDidCatch的区别是前者展示降级UI，后者记录具体的错误信息，它只能用于class组件
```
scala
复制代码import React from "react"
class ErrorBoundary extends React.Component{
  constructor(props){
    super(props)
    this.state={
      hasError:false
    }
  }
  staic getDerivedStateFromError(){
    return { hasError:true}
  }
  componentDidCatch(err,info){
    console.error(err,info)
  }
  render(){
    if(this.state.hasError){
      return <div>Oops,err</div>
    }
    return this.props.children
  }
}

// App.jsx
import React from "react"
import ErrorBoundary from "./components/ErrorBoundary"
import ComponentA from "./components/ComponentA"
export class App extends React.Component{
  render(){
    return (
      <ErrorBoundary>
        <ComponentA></ComponentA>
      </ErrorBoundary>
    )
  }
}
```
错误边界无法捕获自身的错误，也无法捕获事件处理、异步代码(setTimeout、requestAnimationFrame)、服务端渲染的错误<br />**Portal**<br />Portal提供了让子组件渲染在除了父组件之外的DOM节点的方式,它接收两个参数，第一个是需要渲染的React元素，第二个是渲染的地方(DOM元素)<br />用途：弹窗、提示框等<br />[Fragment](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Ffragments.html%23gatsby-focus-wrapper)<br />Fragment提供了一种将子列表分组又不产生额外DOM节点的方法<br />[Context](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fcontext.html%23gatsby-focus-wrapper)<br />常规的组件数据传递是使用props，当一个嵌套组件向另一个嵌套组件传递数据时，props会被传递很多层，很多不需要用到props的组件也引入了数据，会造成数据来源不清晰，多余的变量定义等问题，Context提供了一种跨层级组件数据传递的方法<br />[Suspense](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Freact-api.html%23suspense)<br />Suspense使组件允许在某些操作结束后再进行渲染，比如接口请求,一般与React.lazy一起使用<br />Transition<br />Transition是React18引入的一个并发特性，允许操作被中断，避免回到可见内容的Suspense降级方案
<a name="sG0X6"></a>
### Redux工作原理
Redux是一个状态管理库，使用场景：

- 跨层级组件数据共享与通信
- 一些需要持久化的全局数据，比如用户登录信息

![](https://cdn.nlark.com/yuque/0/2023/webp/12536841/1689327557727-cb144135-b42b-48d9-a248-e9cfa7d181fb.webp#averageHue=%23f6ebc6&clientId=ufbd977c4-3c51-4&from=paste&id=u5945e804&originHeight=385&originWidth=720&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u073d0d7d-ff8b-488f-af35-b75b86ed8d9&title=)<br />Redux工作原理<br />使用单例模式实现<br />Store 一个全局状态管理对象<br />Reducer 一个纯函数，根据旧state和props更新新state<br />Action 改变状态的唯一方式是dispatch action
<a name="oEcaP"></a>
### React-Router
![image.png](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689330190217-1b794630-15c1-44da-9af5-3c3165443b6b.png#averageHue=%23fafafa&clientId=ud5d25d78-0b26-4&from=paste&height=546&id=uc6df5c35&originHeight=594&originWidth=809&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=20831&status=done&style=none&taskId=u69dbea5e-eab1-4409-a093-76ef961fdcb&title=&width=743.2000122070312)
<a name="zMHo0"></a>
#### 为什么需要前端路由

1. 早期：一个页面对应一个路由，路由跳转导致页面刷新，用户体验差
2. ajax的出现使得不刷新页面也可以更新页面内容，出现了_SPA_（单页应用）。_SPA_不能记住用户操作，只有一个页面对URL做映射，SEO不友好
3. 前端路由帮助我们在仅有一个页面时记住用户进行了哪些操作
<a name="BMAj5"></a>
#### 前端路由解决了什么问题

1. 当用户刷新页面，浏览器会根据当前URL对资源进行重定向(发起请求)
2. 单页面对服务端来说就是一套资源，怎么做到不同的URL映射不同的视图内容
3. 拦截用户的刷新操作，避免不必要的资源请求；感知URL的变化

**react-router-dom有哪些组件**<br />HashRouter/BrowserRouter 路由器<br />Route 路由匹配<br />Link 链接，在html中是个锚点<br />NavLink 当前活动链接<br />Switch 路由跳转<br />Redirect 路由重定向
```
ini
复制代码<Link to="/home">Home</Link>
<NavLink to="/abount" activeClassName="active">About</NavLink>
<Redirect to="/dashboard">Dashboard</Redirect>
```
React Router核心能力：**跳转**<br />**路由**负责定义路径和组件的映射关系<br />**导航**负责触发路由的改变<br />路由器根据Route定义的映射关系为新的路径匹配对应的逻辑<br />**BrowserRouter**使用的**HTML5**的**history api**实现路由跳转<br />**HashRoute**r使用URL的**hash属性**控制路由跳转<br />**前端通用路由解决方案**

- hash模式

改变URL以#分割的路径字符串，让页面感知路由变化的一种模式,通过_hashchange_事件触发

- history模式

通过浏览器的history api实现,通过_popState_事件触发
<a name="f4eb3b7d"></a>
#### ReactRouter 组件的理解，常用的 react router 组件
react-router 等前端路由的原理大致相同，可以实现无刷新的条件下切换显示不同的页面。<br />路由的本质就是页面的 URL 发生改变时，页面的显示结果可以根据 URL 的变化而变化，但是页面不会刷新。<br />因此，可以通过前端路由可以实现单页(SPA)应用<br />react-router 主要分成了几个不同的包：

- react-router: 实现了路由的核心功能
- react-router-dom： 基于 react-router，加入了在浏览器运行环境下的一些功能
- react-router-native：基于 react-router，加入了 react-native 运行环境下的一些功能
- react-router-config: 用于配置静态路由的工具库
<a name="2c6a40a8"></a>
#### ReactRouter 常用组件

- BrowserRouter、HashRouter：使用两者作为最顶层组件包裹其他组件，分别匹配 history 模式和 hash 模式
- Route：Route 用于路径的匹配，然后进行组件的渲染，对应的属性如下： 
   - path 属性：用于设置匹配到的路径
   - component 属性：设置匹配到路径后，渲染的组件
   - render 属性：设置匹配到路径后，渲染的内容
   - exact 属性：开启精准匹配，只有精准匹配到完全一致的路径，才会渲染对应的组件
- Link、NavLink：通常路径的跳转是使用 Link 组件，最终会被渲染成 a 元素，其中属性 to 代替 a 标题的 href 属性<br />NavLink 是在 Link 基础之上增加了一些样式属性，例如组件被选中时，发生样式变化，则可以设置 NavLink 的一下属性： 
   - activeStyle：活跃时（匹配时）的样式
   - activeClassName：活跃时添加的 class
- switch：switch 组件的作用适用于当匹配到第一个组件的时候，后面的组件就不应该继续匹配
- redirect：路由的重定向
<a name="f47c7dc9"></a>
#### ReactRouter 常用 Hooks

- useHistory：组件内部直接访问 history，无须通过 props 获取
- useParams：获取路由参数
- useLocation：返回当前 URL 的 location 对象
<a name="051c13d6"></a>
#### ReactRouter 传参

- 动态路由的方式（params） 优点：刷新页面，参数不丢失 缺点：1.只能传字符串，传值过多 url 会变得很长 2.参数必须在路由上配置
- search 传递参数 优点：刷新页面，参数不丢失 缺点：只能传字符串，传值过多 url 会变得很长，获取参数需要自定义 hooks
- state 传参 优点：可以传对象 缺点：1.刷新页面，参数丢失, 2.通过 state 传递参数，刷新页面后参数丢失，官方建议使用，页面刷新参数也不会丢失。
- query 优点：传参优雅，传递参数可传对象； 缺点：刷新地址栏，参数丢失
<a name="a520896a"></a>
##### 动态路由的方式（params）
```
// 路由配置
{ path: '/detail/:id/:name', component: Detail }
```
```
// 路由跳转：
import { useHistory,useParams } from 'react-router-dom';
const history = useHistory();
// 跳转路由   地址栏：/detail/2/zora
history.push('/detail/2/zora')
<!--或者-->
this.props.history.push( '/detail/2/zora' )
```
```
// 获取路由参数
const params = useParams()
console.log(params) // {id: "2",name:"zora"}
<!-- 或者 -->
this.props.match.params
```
<a name="415c0de8"></a>
##### search 传递参数
路由不需要特别配置<br />路由跳转
```
import { useHistory } from 'react-router-dom';
const history = useHistory();
// 路由跳转  地址栏：/detail?id=2
history.push('/detail?id=2')
// 或者
history.push({pathname:'/detail',search:'?id=2'})
```
获取参数：所获取的是查询字符串，所以，还需要进一步的解析，自己自行解析，也可以使用第三方模块：qs，或者 nodejs 里的 query-string
```
const params = useLocation()
<!--或者-->
this.props.location.search
```
<a name="3a652745"></a>
##### state 传参
路由不需要单独配置<br />路由跳转：
```
import { useHistory,useLocation } from 'react-router-dom';
const history = useHistory();
const item = {id:1,name:"zora"}
// 路由跳转
history.push(`/user/role/detail`, { id: item });
<!--或者-->
this.props.history.push({pathname:"/sort ",state : { name : 'sunny' }});
```
获取参数：
```
// 参数获取
const {state} = useLocation()
console.log(state)  // {id:1,name:"zora"}
<!--或者-->
this.props.location.state
```
<a name="query"></a>
##### query
路由不需要特别配置<br />路由跳转：
```
this.props.history.push({pathname:"/query",query: { name : 'sunny' }});
```
获取参数：
```
this.props.location.query.name
```
<a name="7f6b767f"></a>
#### React Router 有几种模式，实现原理是什么
react Router 有四个库：

- react router：核心库，封装了 Router，Route，Switch 等核心组件,实现了从路由的改变到组件的更新的核心功能,
- react router dom：dom 环境下的 router。在 react-router 的核心基础上，添加了用于跳转的 Link 组件，和 histoy 模式下的 BrowserRouter 和 hash 模式下的 HashRouter 组件等。所谓 BrowserRouter 和 HashRouter，也只不过用了 history 库中 createBrowserHistory 和 createHashHistory 方法
- react router native：RN 环境下的 router
- react router config<br />在单页应用中，一个 web 项目只有一个 html 页面，一旦页面加载完成之后，就不用因为用户的操作而进行页面的重新加载或者跳转，其特性如下：
- 改变 url 且不让浏览器像服务器发送请求
- 在不刷新页面的前提下动态改变浏览器地址栏中的 URL 地址<br />react router dom 其中主要分成了两种模式：
- hash 模式：在 url 后面加上#，如http://127.0.0.1:5500/home/#/page1
- history 模式：允许操作浏览器的曾经在标签页或者框架里访问的会话历史记录<br />React Router 对应的 hash 模式和 history 模式对应的组件为：
- HashRouter
- BrowserRouter<br />这两个组件的使用都十分的简单，作为最顶层组件包裹其他组件
<a name="NgQcr"></a>
##### 原理
单页面应用路由实现原理是，切换 url，监听 url 变化，从而渲染不同的页面组件。<br />主要的方式有 history 模式和 hash 模式。
<a name="WzoQK"></a>
###### history 模式
① 改变路由<br />**history.pushState**
```
history.pushState(state,title,path)
```

1. state：一个与指定网址相关的状态对象， popstate 事件触发时，该对象会传入回调函数。如果不需要可填 null。
2. title：新页面的标题，但是所有浏览器目前都忽略这个值，可填 null。
3. path：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个地址<br />**history.replaceState**
```
history.replaceState(state,title,path)
```
参数和 pushState 一样，这个方法会修改当前的 history 对象记录， history.length 的长度不会改变。<br />② 监听路由
```
window.addEventListener('popstate',function(e){
    /* 监听改变 */
})
```

同一个文档的 history 对象出现变化时，就会触发 popstate 事件  history.pushState 可以使浏览器地址改变，但是无需刷新页面。注意 ⚠️ 的是：用 history.pushState() 或者 history.replaceState() 不会触发 popstate 事件。 popstate 事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮或者调用 history.back()、history.forward()、history.go()方法。
<a name="PhE4E"></a>
###### hash 模式
① 改变路由
```
window.location.hash
```
通过 window.location.hash 属性获取和设置 hash 值。<br />在 hash 模式下 ，history.push  底层是调用了 window.location.href 来改变路由。history.replace 底层是调用  window.location.replace 改变路由。<br />② 监听路由<br />onhashchange
```
window.addEventListener('hashchange',function(e){
    /* 监听改变 */
})
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/12536841/1689328140969-f34c1209-cfa9-4dd4-a4be-5d76cfc58c82.png#averageHue=%23f4efe7&clientId=ufbd977c4-3c51-4&from=paste&height=367&id=uf4be6888&originHeight=459&originWidth=764&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=204401&status=done&style=none&taskId=ud2f9675d-efde-4c07-95f9-a5e4cbdb830&title=&width=611.2)
<a name="vVWVF"></a>
#### 当地址栏改变 url，组件的更新渲染都经历了什么
当 url 改变，首先触发 histoy，调用事件监听 popstate 事件， 触发回调函数 handlePopState，触发 history 下面的 setstate 方法，产生新的 location 对象，然后通知 Router 组件更新 location 并通过 context 上下文传递，switch 通过传递的更新流，匹配出符合的 Route 组件渲染，最后有 Route 组件取出 context 内容，传递给渲染页面，渲染更新。
<a name="bNGx3"></a>
#### 当我们调用 history.push 方法，切换路由，组件的更新渲染又都经历了什么呢？
我们还是拿 history 模式作为参考，当我们调用 history.push 方法，首先调用 history 的 push 方法，通过 history.pushState 来改变当前 url，接下来触发 history 下面的 setState 方法，接下来的步骤就和上面一模一样了

<a name="IviT7"></a>
#### BrowserRouter 与 HashRouter 对⽐

- HashRouter 最简单，每次路由变化不需要服务端接入，根据浏览器的 hash 来区分 path 就可以；BrowserRouter 需要服务端解析 URL 返回页面，因此使用 BrowserRouter 需要在后端配置地址映射。
- BrowserRouter 触发路由变化的本质是使⽤ HTML5 history API（ pushState、replaceState 和 popstate 事件）
- HashRouter 不⽀持 location.key 和 location.state，动态路由需要通过?传递参数。
- Hash history 只需要服务端配置一个地址就可以上线，但线上的 web 应⽤很少使用这种方式。

<a name="aQZQb"></a>
#### MemoryRouter
把 URL 的历史记录保存在内存中的 （不读取、不写入地址栏）。在测试和非浏览器环境中很有用，如 React Native
<a name="imvq4"></a>
### react第三方库

- nextjs
- umijs
- jotai
- react query
- ahooks
- 对于SSR，可以使用Next.js、Remix接管数据请求。
- 对于CSR，可以使用React Query、useSWR接管数据请求。
- useSWR  Vercel 团队维护的 React 数据请求管理库，Vercel 同时也是 Next.js 的创始团队

