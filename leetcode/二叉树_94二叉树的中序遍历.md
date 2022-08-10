### 给定一个二叉树的根节点 root ，返回 它的 中序 遍历 。

- 方法一：递归  
思路：左中右的顺序递归调用，注意，递归方法定义在入口方法内部 
```
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    let result=[];
    if(root === null) return

    let order = (node)=>{
        if(node.left!==null){
            order(node.left)
        }
        result.push(node.val)
        if(node.right!==null){
            order(node.right)
        }
    }
    order(root)
    return result;
};
```

- 方法二：迭代  
思路：
  - 用数组模拟栈，先进后出，中序遍历：左中右  
  - 先沿着树左节点走到底，每一项放到栈中，走到底后，可以直接弹出，该值为左或中的值
  - 判断其右子节点是否存在，存在直接弹出，继续同上操作
```
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    const result = [];
    if(root===null) return []
    const stack = [];

    let temp = root;
    while(temp !== null){
        stack.push(temp)
        temp = temp.left
    }

    while(stack.length>0){
        const current = stack.pop()
        result.push(current?.val)
        if(current.right !== null){
            let temp2 = current.right
            while(temp2!==null){
                stack.push(temp2)
                temp2 = temp2.left
            }
        }
    }
    return result;
};
```