

二者实现继承的方式不同
```
 type exampleType1 = {
        name: string
    }
    interface exampleInterface1 {
        name: string
    }
    
    
    type exampleType2 = exampleType1 & {
        age: number
    }
    type exampleType2 = exampleInterface1 & {
        age: number
    }
    interface exampleInterface2 extends exampleType1 {
        age: number
    }
    interface exampleInterface2 extends exampleInterface1 {
        age: number
    }
```



type可以做到，但interface不能做到的事情
  1. type可以定义 基本类型的别名，如 ***type myString = string***
  2. type可以通过 typeof 操作符来定义，如 ***type myType = typeof someObj***
  3. type可以申明 联合类型，如 ***type unionType = myType1 | myType2***
  4. type可以申明 元组类型，如 ***type yuanzu = [myType1, myType2]***

interface可以做到，但是type不可以做到
  1. interface可以 声明合并，示例如下
    ```
      interface test {
        name: string
      }
      interface test {
          age: number
      }
      
      /*
          test实际为 {
              name: string
              age: number
          }
      */
    ```
这种情况下，如果是type的话，就会报 重复定义 的警告，因此是无法实现 声明合并 的

还有一种情况需要注意
  ```
  /*
      会报错，如果重复定义同一个属性，其类型必须相同
   */
   interface test {
       name: string
   }
   interface test {
       name: number
   }
  ```