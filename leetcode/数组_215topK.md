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

```
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */

const findKthLargest = (nums, k) => {
  const n = nums.length;

  const quick = (l, r) => {
    if (l > r) return;
    let random = Math.floor(Math.random() * (r - l + 1)) + l; // 随机选取一个index
    swap(nums, random, r); // 将它和位置r的元素交换，让 nums[r] 作为 pivot 元素
    /**
     * 我们选定一个 pivot 元素，根据它进行 partition
     * partition 找出一个位置：它左边的元素都比pivot小，右边的元素都比pivot大
     * 左边和右边的元素的是未排序的，但 pivotIndex 是确定下来的
    */
    let pivotIndex = partition(nums, l, r);
    /**
     * 我们希望这个 pivotIndex 正好是 n-k
     * 如果 n - k 小于 pivotIndex，则在 pivotIndex 的左边继续找
     * 如果 n - k 大于 pivotIndex，则在 pivotIndex 的右边继续找
     */
    if (n - k < pivotIndex) {
      quick(l, pivotIndex - 1);
    } else {
      quick(pivotIndex + 1, r);
    }
    /**
     * n - k == pivotIndex ，此时 nums 数组被 n-k 分成两部分
     * 左边元素比 nums[n-k] 小，右边比 nums[n-k] 大，因此 nums[n-k] 就是第K大的元素
     */
  };

  quick(0, n - 1); // 让n-k位置的左边都比 nums[n-k] 小，右边都比 nums[n-k] 大
  return nums[n - k];
};

function partition(nums, left, right) {
  let pivot = nums[right];             // 最右边的元素作为 pivot 元素
  let pivotIndex = left;               // pivotIndex 初始为 left
  for (let i = left; i < right; i++) { // 逐个考察元素，和 pivot 比较
    if (nums[i] < pivot) {             // 如果当前元素比 pivot 小
      swap(nums, i, pivotIndex);       // 将它交换到 pivotIndex 的位置
      pivotIndex++;
    }
  }                                    // 循环结束时，pivotIndex左边都是比pivot小的
  swap(nums, right, pivotIndex);       // pivotIndex和right交换，更新pivot元素
  return pivotIndex;                   // 返回 pivotIndex 下标
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
