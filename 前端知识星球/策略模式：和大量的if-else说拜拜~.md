---
theme: smartblue
---


在群里看到群友提问：

![1697100249711.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e61251c859704855abe3457fcc59189f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=593&h=388&s=33919&e=png&b=f7f7f7)

先来模拟下他的代码：

```jsx
// 模拟后端返回数据
var item = {
    targetName: '低',
    viewMod: '场景', // 或者 '区域'
    thresholdValue: '2,4,6,8',
    tatgetAlgo: ''
};

// 模拟逻辑
if (item.targetName == '无') {
    item.tatgetAlgo = '根满分';
} else if (item.targetName == '弱') {
    if (item.viewMod.indexOf('场景') > -1) {
        var arr = item.thresholdValue.split(',', 7);
        item.tatgetAlgo = `以下 ${arr[0]} % ；`;
    } else if (item.viewMod.indexOf('区域') > -1) {
        var arr = item.thresholdValue.split(',', 3);
        item.tatgetAlgo = `1、问题 ${arr[0]} ；`;
    }
} else if (item.targetName == '低') {
    if (item.viewMod.indexOf('场景') > -1) {
        var arr = item.thresholdValue.split(',', 4);
        item.tatgetAlgo = `以下 ${arr[3]}G；`;
    } else if (item.viewMod.indexOf('区域') > -1) {
        var arr = item.thresholdValue.split(',', 2);
        item.tatgetAlgo = `1、问题得分`;
    }
}
```
可以看到有大量的if判断操作，逻辑比较复杂，如果线上有bug，处理起来也很麻烦。那么有什么好的方式来优化分支代码呢？ `ps：文章末尾有方案哦`

先来看一个简单的例子：  
定义一个名为 `speak` 的函数，该函数根据传入的参数 `name` 的不同值输出不同的字符串。具体来说：
-   如果 `name` 的值是 `'剑圣'`，则输出 `'真正的大师永远都怀着一颗学徒的心。'`。
-   如果 `name` 的值是 `'盖伦'`，则输出 `'生命不息，战斗不止。'`。
-   如果 `name` 的值是 `'阿木木'`，则输出 `'我还以为你从来都不会选我呢。'`。
-   如果 `name` 的值是 `'诺手'`，则输出 `'只有我才能带领我们走向胜利。'`。
-   如果 `name` 的值不是以上任何一个值，那么输出 `'我是谁？'`。

### 青铜
```jsx
function speak(name){
    if(name==='剑圣'){
        console.log('真正的大师永远都怀着一颗学徒的心。')
    } else if(name==='盖伦'){
        console.log('生命不息，战斗不止。')
    } else if(name==='阿木木'){
        console.log('我还以为你从来都不会选我呢。')
    } else if(name==='诺手'){
        console.log('只有我才能带领我们走向胜利。')
    } else {
       console.log('我是谁？')
    }
}

speak('诺手') //'只有我才能带领我们走向胜利。'
```
问题：代码中含有大量的 `if-else` 判断逻辑，维护困难。当代码逻辑数量达到几百个时，代码的可读性大大降低。


### 白银
白银参考了策略模式的思路，将逻辑封装到一个对象中。这种方式使得这个对象能够独立出来，只需专注于维护这个对象本身即可。
```jsx
function speak(name){
    let map = {
        '剑圣': '真正的大师永远都怀着一颗学徒的心。',
        '盖伦': '生命不息，战斗不止。',
        '阿木木': '我还以为你从来都不会选我呢。',
        '诺手': '只有我才能带领我们走向胜利。',
    }

    if(map[name]){
       console.log(map[name])
    } else {
       console.log('我是谁？')
    }
}

speak('诺手') //'只有我才能带领我们走向胜利。'
```
问题：这里的方法都一致只是参数不同，，盖伦说`我需要蹲草丛里，我是草丛伦`，阿木木说`猥琐发育等我六级`，诺手说`无情铁手致命打击大杀四方`。这样写，似乎是没问题的。但如果每个方法不同，阁下该如何应对呢？比如在说台词之后，需要有自己单独的逻辑，比如盖伦说`生命不息，战斗不止`后再说`我需要蹲草丛里，我是草丛伦`？


### 黄金
将对象中的处理逻辑单独封装成一个函数，内部处理自己的逻辑。

```jsx
function speak(name){
    let map = {
        '剑圣': ()=> {
            console.log('真正的大师永远都怀着一颗学徒的心。','你们先上我开团')
         },
        '盖伦': ()=> { 
            console.log('生命不息，战斗不止');
            console.log('我需要蹲草丛里，我是草丛伦')
         },
        '阿木木': ()=> {
            console.log('我还以为你从来都不会选我呢');
            console.log('猥琐发育等我六级');
            console.log('猥琐发育等我六级!!');
         },
        '诺手': ()=> {
            console.log('无情铁手致命打击大杀四方')
        },
    }

    if(map[name]){
      map[name]()
    } else {
       console.log('我是谁？')
    }
}

speak('剑圣') //'真正的大师永远都怀着一颗学徒的心。' '你们先上我开团'
```

问题： 现在`回答逻辑`抽离出来了，但是`判断逻辑`还是有问题，。如果每个条件中的`判断逻辑`不一样怎么办呢？

### 铂金
我要除了判断姓名外，还要判断剑圣和盖伦的武器是什么不是剑，要判断阿木木等级是不是大于等于6级。诺手的等级是不大于等于16级。铂金可能会选择返璞归真，直接用if else实现，这样的逻辑很常见，也比较清晰一些。

```jsx
function speak(name,weapon,level){
    if(name==='剑圣' && weapon.includes('剑')){
        console.log('真正的大师永远都怀着一颗学徒的心。','你们先上我开团')
    }else if(name==='盖伦'&&weapon.includes('剑')){
         console.log('生命不息，战斗不止');
         console.log('我需要蹲草丛里，我是草丛伦');
    }else if(name==='阿木木'&&level>=6){
        console.log('我还以为你从来都不会选我呢');
        console.log('猥琐发育等我六级');
        console.log('猥琐发育等我六级!!');
    }else if(name==='诺手'&&level>=16){
        console.log('无情铁手致命打击大杀四方')
    }else {
       console.log('我是谁？')
    }
}

speak('盖伦','大宝剑',4) //'生命不息，战斗不止'  //'我需要蹲草丛里，我是草丛伦'
speak('盖伦','大保健',6) //'我是谁？'
```

### 钻石
怎么将上面的逻辑封装成策略模式呢？来看看钻石的做法。首先将map改造成一个二维数组，每一子项数组中第一项是`判断逻辑`函数，第二项是`回答逻辑`函数。

```jsx
function speak(name,weapon,level){
    let map = [
        [ 
            ()=> { name==='剑圣' && weapon.includes('剑') }, 
            ()=> { console.log('真正的大师永远都怀着一颗学徒的心。','你们先上我开团')}
        ],
        [ 
            ()=> { name==='盖伦' && weapon.includes('剑') }, 
            ()=> { console.log('生命不息，战斗不止'); console.log('我需要蹲草丛里，我是草丛伦')}
        ],
        [ 
            ()=> { name==='阿木木' && level>=6}, 
            ()=> {  console.log('我还以为你从来都不会选我呢');console.log('猥琐发育等我六级'); console.log('猥琐发育等我六级!!');}
        ],
        [ 
            ()=> { name==='诺手' && level>=16 }, 
            ()=> { console.log('无情铁手致命打击大杀四方') }
        ],
    ]
    const target = map.find(item=>item[0]())
    if(target){
      target[1]()
    } else {
       console.log('我是谁？')
    }
}

speak('盖伦','大宝剑',4) //'生命不息，战斗不止'  //'我需要蹲草丛里，我是草丛伦'
speak('盖伦','大保健',6) //'我是谁？'
```
同理，按照这个思路可以把文章开头的例子优化了：
```jsx
// 调用示例
const item = {
    targetName: '弱',
    viewMod: ['场景'],
    thresholdValue: '1,2,3,4,5,6,7'
};

let map = [
    [
        () => item.targetName === '无',
        () => {
            item.tatgetAlgo = '根满分';
        }
    ],
    [
        () => item.targetName === '弱' && item.viewMod.indexOf('场景') > -1,
        () => {
            var arr = item.thresholdValue.split(',', 7);
            item.tatgetAlgo = `以下 ${arr[0]} % ；`;
        }
    ],
    [
        () => item.targetName === '弱' && item.viewMod.indexOf('区域') > -1,
        () => {
            var arr = item.thresholdValue.split(',', 3);
            item.tatgetAlgo = `1、问题 ${arr[0]} ；`;
        }
    ],
    [
        () => item.targetName === '低' && item.viewMod.indexOf('场景') > -1,
        () => {
            var arr = item.thresholdValue.split(',', 4);
            item.tatgetAlgo = `以下 ${arr[3]}G；`;
        }
    ],
    [
        () => item.targetName === '低' && item.viewMod.indexOf('区域') > -1,
        () => {
            var arr = item.thresholdValue.split(',', 2);
            item.tatgetAlgo = `1、问题得分`;
        }
    ]
];

const target = map.find(item => item[0]());
if (target) {
    target[1]();
}

```
### 最强王者

最强王者段位的代码，就靠评论区的各位了~
