Set对象是值的集合，你可以按照插入的顺序迭代它的元素。 Set中的元素只会出现一次，即 Set 中的元素是唯一的。


- 实例属性
  - size：返回Set对象中的值的个数

- 实例方法
  - add(value)：在Set的尾部添加一个元素。返回该Set对象
  - clear()：移除Set对象内的所有元素
  - delete(value)：移除Set中与这个值相等的元素，返回has(value)在这个操作前返回的值
  - entries()：返回一个新的迭代器对象，该对象包含Set对象中的按插入顺序排列的所有元素的值的[value, value]数组
  - forEach(callback[, thisArg])：按照插入顺序，为Set对象中的每一个值调用一次callBackFn。如果提供了thisArg参数，回调中的this会是这个参数
  - has(val)：返回一个布尔值，表示该值在Set中存在与否
  - values()：返回一个新的迭代器，该对象包含Set对象中的按插入顺序排列的所有元素的值
  - @@iterator]()：同values()

```
class Set {
  constructor(values){
    this._values = [];
    this.size = 0;

    // 迭代属性
    this[Symbol.iterator] = this.values;

    values.length && values.forEach((v) => this.add(v));
  }

  has(value) {
    return this._values.includes(value);
  }

  add(value){
     if (!this.has(value)) {
      this._values.push(value);
      this.size++;
    }
    return this;
  }

  delete(value) {
    const hasValue = this.has(value);
    if (hasValue) {
      this._values = this._values.filter((v) => v !== value);
      this.size--;
    }
    return hasValue;
  }

  clear() {
    this._values = [];
    this.size = 0;
  }

  // 获取values组成的迭代器
  values() {
    return this._createIterator([...this._values]);
  }

  // 返回一个新的迭代器对象
  entries() {
    const entries = [];
    for (let value of this._values) {
      entries.push([value, value]);
    }

    return this._createIterator(entries);
  }

  forEach(callback, thisArg = {}) {
    for (let i = 0; i < this._values.length; i++) {
      const value = this._values[i];
      callback.call(thisArg, value, i, this);
    }
  }

  // 生成迭代器
  *_createIterator(items) {
    for (let i = 0; i < items.length; i++) {
      yield items[i];
    }
  }

}

```