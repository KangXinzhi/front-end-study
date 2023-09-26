```
import React from 'react'
import { useSize } from 'ahooks'

// 配置 html font-size。默认设计稿宽度为 1920。 1rem = 100px
export default function useRem(designWidth = 1920) {
  const { width = 0 } = useSize(document.documentElement)
  const def = 100 / designWidth
  const rem = def * width
  React.useEffect(() => {
    document.documentElement.style.fontSize = `${rem}px`
    document.documentElement.style.overflowX = 'hidden'
  }, [width])
  return rem
}
```