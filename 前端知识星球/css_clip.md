CSS 世界中有些属性或者特性必须和其他属性一起使用才有效，比方说剪裁属性 clip。  
clip 属性要想起作用，元素必须是绝对定位或者固定定位，也就是position 属性值必须是absolute 或者fixed。  
clip: rect(top, right, bottom, left) // 裁剪图片

作用：
- fixed 固定定位的剪裁
- 最佳可访问性隐藏 


对于普通元素或者绝对定位元素，想要对其进行剪裁，我们可以利用语义更明显的overflow 属性，但是对于position:fixed 元素，overflow 属性往往就力不能及了，因
为 fixed 固定定位元素的包含块是根元素，除非是根元素滚动条，普通元素的 overflow 是根本无法对其进行剪裁的。怎么办呢？  
此时就要用到名不经传的 clip 属性了。再嚣张的固定定位，clip 属性也能立马将它剪裁得服服帖帖的。例如： 
``` 
.fixed-clip { 
  position: fixed; 
  clip: rect(30px 200px 200px 20px); 
}
```


举个例子，很多网站左上角都有包含自己网站名称的标识（logo），而这些标识一般都是图片，为了更好地SEO 以及无障碍识别，我们一般会使用<h1>标签写上网站的名称，代码如 下：   
```
<a href="/" class="logo"> 
  <h1>CSS 世界</h1> 
</a>
```

隐藏：
- 下策是display:none 或者visibility:hidden 隐藏，因为屏幕阅读设备会忽略这里的文字。
- text-indent 缩进是中策，但文字如果缩进过大，大到屏幕之外，屏幕阅读设备也是不会读取的。
- color:transparent 是移动端上策，但却是桌面端中策，因为原生IE8 浏览器并不支持它。color:transparent 声明，很难用简单的方式阻止文本被框选。
- clip 剪裁隐藏是上策，既满足视觉上的隐藏，屏幕阅读设备等辅助设备也支持得很好。 
```
.logo h1 {
  position: absolute; 
  clip: rect(0 0 0 0); 
} 
``` 

