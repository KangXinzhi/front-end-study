### LeetCode-215 数组中的第 K 个最大的元素

215. 数组中的第 K 个最大元素
     中等
     2.1K
     相关企业
     给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。

示例 1:

输入: [3,2,1,5,6,4], k = 2
输出: 5
示例 2:

输入: [3,2,3,1,2,4,5,5,6], k = 4
输出: 4

- 解法一： 快排

思路：

- n 为数组的长度
- 数组中的第 1 大元素，是，从小到大排序后 n - 1 位置上的元素
- 数组中的第 k 大元素，即，从小到大排序后 n - k 位置上的元素
- 我们希望位置 n - k 的左边是比它小的，右边是比它大的，那么 nums[n - k] 就是第 k 大的元素
- 我们把 n-k 看作 pivot ，用快速排序的手法去 partition “分区”

```
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */

const findKthLargest = (nums, k) => {
  const len = nums.length;
  const target = len - k;
  let left = 0;
  let right = len-1;
  while(left<=right){
      let pivotIndex = partition(nums,left,right)
      if(pivotIndex==target){
          return nums[pivotIndex]
      }else if(pivotIndex < target){
          left = pivotIndex + 1
      }else{
          right = pivotIndex - 1
      }
  }
};

function partition(nums, left, right) {
    // Math.random(): 0~1 目标left~right
    // parseInt(Math.random() * (right - left)) 表示 [0, right-left]
    // parseInt(Math.random() * (right - left))+ left 表示 [left,right]
    let random = parseInt(Math.random() * (right - left)) + left
    swap(nums,left,random)

    let j = left;
    let pivot = nums[left];

    for(let i = left + 1; i<= right;i++){
        if(nums[i]<=pivot){
            j++;
            swap(nums,j,i)
        }
    }
    swap(nums,left,j)
    return j;
}

function swap(nums, p, q) {
  const temp = nums[p];
  nums[p] = nums[q];
  nums[q] = temp;
}
```

- 解法二： 分治算法

```
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */

var findKthLargest = function(nums, k) {
    let base = nums[0]
    let left = [];
    let right = [];
    let equal = [];
    for(let i = 0; i<nums.length;i++){
        if(nums[i]>base){
            right.push(nums[i])
        }else if(nums[i]<base){
            left.push(nums[i])
        }else{
            equal.push(nums[i])
        }
    }

    if(right.length>=k){
        return findKthLargest(right, k)
    }else if(equal.length>=k-right.length){
        return base;
    }else{
        return findKthLargest(left, k-right.length-equal.length)
    }

};
```

- 解法三： sort

```
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */

var findKthLargest = function(nums, k) {
    nums.sort((a,b)=>b-a)
    return nums[k-1]
};
```
