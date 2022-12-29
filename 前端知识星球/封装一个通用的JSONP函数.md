```
对应的后端域名为 https://api.qq.com，后端会对queryString 进行一下处理：
1.读取 QCBName 字段作为返回的方法名
2.读取 QDATA 作为传入字段

const QQ_JSONP(url: string, data: Record<string, unknown>): Promise<unknow> => {
    // TODO
}

// 使用者可以直接调用
QQ_JSONP('/data', { username: '' })
    .then(() => {});
```

```
const QQ_JSONP = (url: string, data: Record<string, unknown>): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${Date.now()}`;
    // 将callbackName作为QCBName字段传入
    data.QCBName = callbackName;
    // 将data转化为queryString
    const queryString = Object.entries(data)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    // 创建script标签
    const script = document.createElement('script');
    script.src = `https://api.qq.com${url}?${queryString}`;
    // 挂载回调函数
    window[callbackName] = (response: unknown) => {
      delete window[callbackName];
      document.body.removeChild(script);
      resolve(response);
    };
    // 处理错误
    script.onerror = (error: Event) => {
      delete window[callbackName];
      document.body.removeChild(script);
      reject(error);
    };
    document.body.appendChild(script);
  });
};
```
