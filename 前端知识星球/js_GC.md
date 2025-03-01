GC：浏览器的垃圾回收机制（内存释放机制）
1、栈内存释放
1)加载页面，形成一个全局的上下文，只有页面关闭后，全局上下文才会被释放。
2)函数执行会形成一个私有的上下文，进栈执行；当函数中代码执行完成，大部分情况下，形成的上下文都会被出栈释放掉，以此优化栈内存大小；
2、堆内存释放
方案一：（例如谷歌）：查找引用  
浏览器在空闲或者指定时间内，查看所有的堆内存，把没有被任何东西占用的堆内存释放掉；但是占用着的是不被释放的；  
方案二：（例如IE）：引用计数  
创建了堆内存，被占用一次，则浏览器计数+1,取消占用则计数 -1。当记录的数字为零的时候，则内存释放掉；某些情况会导致记数混乱出现“内存泄漏”的现象。  

v8垃圾回收
首先js因为是单线程，垃圾回收会占用主线程，导致页面卡顿，所以需要一个算法或者说策略，而v8采用的是分代式回收，而垃圾回收在堆中分成了很多部分用作不同的作用（我在说什么啊！当时），回收主要表现在新老生代上，新生代就活得短一点的对象，老生代就活得长一点的对象。
“在新生代里有一个算法，将新生代分成了两个区，一个FORM,一个TO，每次经过Scavenge会将FORM区中的没引用的销毁，然后活着的TO区调换位置，反复如此，当经过一次acavange后就会晋升的老生代还有个条件就是TO区的内存超过多少了也会晋升。”
“而老生代，采用标记清除和标记整理，但标记清除会造成内存不连续，所以会有标记整理取解决掉内存碎片，就是清理掉边界碎片”
“为什么TO超过25%要晋升老生代？”
“为了不影响后续FORM空间的分配“
“标记清除是怎么清除的？”
”垃圾回收会构建一个根列表，从根节点去访问那些变量，可访问到位活动，不可就是垃圾”

V8 它采用了分代式垃圾回收机制。因此，V8 将内存(堆)分为新生代和老生代两部分。
新生代中的对象一般存活时间较短，通常会把小的对象分到这里，老生代中的对象一般存活时间较长且数量也多，对应的使用副垃圾回收器 和 主垃圾回收器;副垃圾回收器采用 Scavenge 算法，主垃圾回收器采用 标记 -清除(Mark- Sweep)和标记-整理(Mark- Compact)算法进行垃圾回收:看起来垃圾回收器有 主副 之分，但不论什么类型的垃圾回收器，他们的执行流程是一样的:
第一步 是 标记 空间中 活动对象和 非活动对象
第二步 是 回收非活动对象所占据的内存
第三步 是做 内存整理，内存整理在新老生代这里有一些区别老生代中:
频繁回收对象后，内存中就会存在大量不连续空间，即 内存碎片内存中出现大量的 内存碎片，可能会导致被后期分配内存时出现内存不足 的情况
所以对他进行整理后，可以将碎片空间整会到一起
新生代中(副垃圾回收器):不会产生碎片，因为他将新生代空间对半分为两个空间，一个是对象空间，一个是空闲空间，当对象空间快写满的时候，就会去进行一次垃圾回收，将依旧存活的对象复制到空闲空间，然后进行翻转，
这也是刚刚提到的，为什么会将新生代空间设置的比较小的原因，如果空间太大的话，需要比较长的时间才会进行一次垃圾回收，之后将对象复制到空闲区域也需要时间的，也是由于新生区的空间不大，所以 很容易 被存活的对象 装满 整个区域。为了解决这个问题，
JavaScript 引擎 采用了 对象晋升策略，即经过 两次垃圾回收 依然存活的对象，会被移动到 老生区中。
除此之外呢，JS它是单线程的,运行在主线程上.一旦开始垃圾收集，就会阻塞JS运行，造成全停顿，为了避免这种卡顿，V8 将标记过程分为一个个的子标记过程，同时让垃圾回收标记和 JS 交替 进行，直到标记阶段完成，即 增量标记(Incremental Marking).
