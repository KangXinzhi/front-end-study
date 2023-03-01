```
给你一个链表的头节点 head 和一个特定值 x ，请你对链表进行分隔，使得所有 小于 x 的节点都出现在 大于或等于 x 的节点之前。

你应当 保留 两个分区中每个节点的初始相对位置。
```

```
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} x
 * @return {ListNode}
 */
var partition = function(head, x) {
  let dummy1 = new ListNode(0,null)
  let dummy2 = new ListNode(0,null)
  let p1 = dummy1;
  let p2 = dummy2;
  while (head){
    if(head.val<x){
      dummy1.next = head
      dummy1 = dummy1.next
    }else{
      dummy2.next = head
      dummy2 = dummy2.next
    }
    head = head.next
  }
  dummy1.next = p2.next
  dummy2.next = null

  return p1.next
};

```
