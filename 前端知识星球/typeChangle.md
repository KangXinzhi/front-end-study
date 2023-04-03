### Partial  
Partial<T>将T的所有属性变成可选的。

```
/**
 * 核心实现就是通过映射类型遍历T上所有的属性，
 * 然后将每个属性设置为可选属性
 */

type Partial<T> = {
  [P in keyof T] ?: T[P]
}
```
- [P in keyof T]通过映射类型，遍历T上的所有属性
- ?:设置为属性为可选的
- T[P]设置类型为原来的类型

扩展一下，将指定的key变成可选类型:
```
/**
 * 主要通过K extends keyof T约束K必须为keyof T的子类型
 * keyof T得到的是T的所有key组成的联合类型
 */
type PartialOptional<T, K extends keyof T> = {
  [P in K]?: T[P];
}

/**
 * @example
 *     type Eg1 = { key1?: string; key2?: number }
 */
type Eg1 = PartialOptional<{
  key1: string,
  key2: number,
  key3: ''
}, 'key1' | 'key2'>;
```

### Readonly原理解析
/**
 * 主要实现是通过映射遍历所有key，
 * 然后给每个key增加一个readonly修饰符
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

/**
 * @example
 * type Eg = {
 *   readonly key1: string;
 *   readonly key2: number;
 * }
 */
type Eg = Readonly<{
  key1: string,
  key2: number,
}>

### Pick
挑选一组属性并组成一个新的类型。
```
type Pick<T,K extends keyof T> = {
  [P in K]: T[P];
}
```

### Record
构造一个type，key为联合类型中的每个子类型，类型为T。
```
/**
 * @example
 * type Eg1 = {
 *   a: { key1: string; };
 *   b: { key1: string; };
 * }
 * @desc 就是遍历第一个参数'a' | 'b'的每个子类型，然后将值设置为第二参数
 */
type Eg1 = Record<'a' | 'b', {key1: string}>
```

Record具体实现：
```
type Record<K extends keyof any,T> = {
  [P in K]: T
}
```

### Exclude
Exclude<T, U>提取存在于T，但不存在于U的类型组成的联合类型。

```
type Exclude<T, K>={
  T extends K ? T : never
}
```

### Extract
Extract<T, U>提取联合类型T和联合类型U的所有交集。
```
type Extract<T, U> = T extends U ? T : never;

/**
 * @example
 *  type Eg = 'key1'
 */
type Eg = Extract<'key1' | 'key2', 'key1'>
```


### Omit

Omit<T, K>从类型T中剔除K中的所有属性。
```
/**
 * 利用Pick实现Omit
 */
type Omit = Pick<T, Exclude<keyof T, K>>;
```

```
type Omit2<T, K extends keyof any> = {
  [P in Exclude<keyof T, K>]: T[P]
}
```

