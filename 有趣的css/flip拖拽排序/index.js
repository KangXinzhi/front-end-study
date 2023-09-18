const list = document.querySelector('.list');
let sourceNode; // 当前正在拖动的是哪个元素
let flip;
list.ondragstart = (e) => {
  setTimeout(() => {
    e.target.classList.add('moving');
  }, 0);
  sourceNode = e.target;
  e.dataTransfer.effectAllowed = 'move';
  flip = new Flip(list.children, 0.3);
};
list.ondragover = (e) => {
  e.preventDefault();
};
list.ondragenter = (e) => {
  e.preventDefault();
  if (e.target === list || e.target === sourceNode) {
    return;
  }
  const children = Array.from(list.children);
  const sourceIndex = children.indexOf(sourceNode);
  const targetIndex = children.indexOf(e.target);
  if (sourceIndex < targetIndex) {
    list.insertBefore(sourceNode, e.target.nextElementSibling);
  } else {
    list.insertBefore(sourceNode, e.target);
  }
  flip.play();
};

list.ondragend = (e) => {
  e.target.classList.remove('moving');
};
