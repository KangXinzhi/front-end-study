/**
 * 
 * const url1 = 'https://dd.com?a=1&b=2&c=%E6%BB%B4%20%E6%BB%B4'
const url2 = 'https://dd.com?a=1&b=2&a=3&c&d='
const url3 = 'https://dd.com?a[]=1&b[]=2&b[]=3&a[]=4'
const url4 = 'https://dd.com?a=1&b=2#/p/?c=3&d[]=4&d[]=5&e[]=6'

[https://dd.com,a=1&b=2#/p/,c=3&d[]=4&d[]=5&e[]=6]
[a=1&b=2#/p/,c=3&d[]=4&d[]=5&e[]=6]
b=2#/p/
b=2

const getUrlQuery = (url, resolveHashQuery = false) => {
  // 实现
}
console.log(getUrlQuery(url1)) // { a: '1', b: '2', c: '滴 滴' }
console.log(getUrlQuery(url2)) // { a: ['1', '3'], b: '2', c: true, d: true }
console.log(getUrlQuery(url3)) // { a: ['1', '4'], b: ['2', '3'] }
console.log(getUrlQuery(url4)) // { a: '1', b: '2' }
console.log(getUrlQuery(url4, true)) // { a: '1', b: '2', c: '3', d: ['4', '5'], e: ['6'] }
 */

const url1 = 'https://dd.com?a=1&b=2&c=%E6%BB%B4%20%E6%BB%B4'
// const url2 = 'https://dd.com?a=1&b=2&a=3&c&d='
const url3 = 'https://dd.com?a[]=1&b[]=2&b[]=3&a[]=4'
const url4 = 'https://dd.com?a=1&b=2#/p/?c=3&d[]=4&d[]=5&e[]=6'

const url2 = 'https://dd.com?aa=1&b=2&aa=3&c&d='


const getUrlQuery = (url, resolveHashQuery = false) => {

  let result = {}

  const urlArr = url.split('?')

  if(urlArr.length===2 || resolveHashQuery){
    let paramsArr = urlArr[1].split('&')
    //[a=1,b=2,c=%E6%BB%B4%20%E6%BB%B4']
    for(let i = 0;i<paramsArr.length;i++){
      let param = paramsArr[i].split('=')

      if( result[param[0]]){
        result[param[0]] = [...result[param[0]], param[1] || true]
      }else if(/\w+\[\]/.test(param[0])){
        let paramTemp = param[0].replace('[]','')
        if( result[paramTemp]){
          result[paramTemp] = [...result[paramTemp], param[1] || true]
        }else{
          result[paramTemp] = [...param[1] || true]
        }
      }else{
        result[param[0]] = param[1] || true
      }
    }
  }

  return result;
}

// console.log(getUrlQuery(url1))
console.log(getUrlQuery(url2))
// console.log(getUrlQuery(url3))