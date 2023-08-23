```
function customParseFloat(str) {
  let result = 0;
  let sign = 1;
  let decimalPlace = 0;
  let isDecimal = false;
  let seenDigit = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === '-' && i === 0) {
      sign = -1;
    } else if (char === '+' && i === 0) {
      // 正号无需特别处理，保持默认的正值
    } else if (char === '.' && !isDecimal) {
      isDecimal = true;
    } else if (char >= '0' && char <= '9') {
      seenDigit = true;
      if (isDecimal) {
        decimalPlace++;
        result = result * 10 + (char.charCodeAt(0) - '0'.charCodeAt(0));
      } else {
        result = result * 10 + (char.charCodeAt(0) - '0'.charCodeAt(0));
      }
    } else {
      // 遇到非数字字符，停止解析
      break;
    }
  }

  if (!seenDigit) {
    return NaN;
  }

  if (isDecimal) {
    result = result / Math.pow(10, decimalPlace);
  }

  return result * sign;
}

// 测试
const numStr = "3.14";
const num = customParseFloat(numStr);
console.log(num); // 输出 3.14，与内置的 parseFloat 效果相同

```

```
function customParseFloat(str) {
  const digitHash = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
    '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
  };

  let result = 0;
  let sign = 1;
  let decimalPlace = 0;
  let isDecimal = false;
  let seenDigit = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === '-' && i === 0) {
      sign = -1;
    } else if (char === '+' && i === 0) {
      // 正号无需特别处理，保持默认的正值
    } else if (char === '.' && !isDecimal) {
      isDecimal = true;
    } else if (char in digitHash) {
      seenDigit = true;
      if (isDecimal) {
        decimalPlace++;
        result = result * 10 + digitHash[char];
      } else {
        result = result * 10 + digitHash[char];
      }
    } else {
      // 遇到非数字字符，停止解析
      break;
    }
  }

  if (!seenDigit) {
    return NaN;
  }

  if (isDecimal) {
    result = result / Math.pow(10, decimalPlace);
  }

  return result * sign;
}

// 测试
const numStr = "3.14";
const num = customParseFloat(numStr);
console.log(num); // 输出 3.14，与内置的 parseFloat 效果相同
```