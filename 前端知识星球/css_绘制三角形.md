- 法一： border实现
```
.triangle {
    width: 0;
    height: 0;
    border: 5px solid #000;
    border-color: transparent transparent #000 transparent;
}
```

- 法二：clip-path

https://bennettfeely.com/clippy/

```
.polygon {
    width: 100px；
    height: 100px;
    background-color: red;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
}
```
