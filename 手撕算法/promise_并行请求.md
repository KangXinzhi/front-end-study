## 实现一个批量请求函数 multiRequest(apis, maxNum)，要求如下：
- 要求最大并发数 maxNum
- 每当有一个请求返回，就留下一个空位，可以增加新的请求
- 所有请求完成后，结果按照 apis 里面的顺序依次打出


```
function multiRequest(apis, maxNum) {
  return new Promise(function(resolve, reject) {
    let result = [];
    let index = 0; // 下一个请求的下标
    let count = 0; // 当前请求完成的数量

    async function request(){
      if (index === apis.length) return;
      const i = index; // 保存序号，使result和apis相对应
      const api = apis[index];
      index++;
      try {
        const resp = await fetch(api);
        // resp 加入到results
        results[i] = resp;
      } catch (err) {
        // err 加入到results
        results[i] = err;
      } finally {
        count++;
        // 判断是否所有的请求都已完成
        if (count === apis.length) {
          console.log('完成了');
          resolve(results);
        }
        request();
      }
    }

    // maxNum和apis.length取最小进行调用
    const times = Math.min(maxNum, apis.length);
    for(let i = 0; i < times; i++) {
      request();
    }
  })             
}

// test
let mock = ['api1', 'api2', 'api3', 'api4', 'api5', 'api6','api7', 'api8', 'api9','api10','api11', 'api12', 'api13','api14', 'api15']
multiRequest(mock, 3).then(results => console.log(results));
```