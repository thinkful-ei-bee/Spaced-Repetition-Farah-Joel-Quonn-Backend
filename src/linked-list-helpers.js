function displayList(list){
  let currNode = list.head;
  while (currNode !== null) {
      console.log("list:" + currNode.value);
      currNode = currNode.next;
  }
}

function size(lst){
  let counter = 0;
  let currNode = lst.head;
  if(!currNode){
      return counter;
  }
  else
      counter++;
  while (!(currNode.next == null)) {
      counter++;
      currNode = currNode.next;
  }
  return counter;
}

function isEmpty(lst){
  let currNode = lst.head;
  if(!currNode){
      return true;
  }
  else {
      return false;
  }
}

function findPrevious(lst, item) {
  let currNode = lst.head;
  while ((currNode !== null) && (currNode.next.value !== item)) {
      currNode = currNode.next;
  }
  return currNode;
}

function findLast(lst){
  if(lst.head === null){
      return 'list is empty';
  } 
  let tempNode = lst.head;
  while(tempNode.next !== null){
      tempNode = tempNode.next;
  }
    return tempNode;
}

function remove(item) {
  if (!this.head) {
    return null;
  }

  //   if item you want to delete is the first item in list
  if (this.head.value === item) {
    this.head = this.head.next;
    return; 
  }

  let currNode = this.head;
  let previousNode = this.head;

  while((currNode !== null) && (currNode.value !== item)) {
    previousNode = currNode;
    currNode = currNode.next;
  }
  if (currNode === null) {
    console.log('Item not found-remove');
    return;
  }
  previousNode.next = currNode.next;
}

 // Insertion
function insertFirst(item) {
  this.head = new _Node(item, this.head)
}

function insertLast(item) {
  if (this.head === null) {
    this.insertFirst(item);
  }
  else {
    let tempNode = this.head;
    while (tempNode.next !== null) {
      tempNode = tempNode.next;
    }
    tempNode.next = new _Node(item, null)
  }
}

function insertAt(item, pos){
  let counter=1;
  if (!this.head) {
    return null;
  }

  let currNode = this.head;
  let previousNode = this.head;

  while((currNode !== null) && (counter < pos)) {
    previousNode = currNode;
    currNode = currNode.next;
    counter ++;
  }
  if (currNode === null) {
    console.log('Item not found-insertAt');
    return;
  }
  let newNode = new _Node (item, currNode);
  previousNode.next = newNode;
}

function insertBefore(itemToAdd, item) {
  // current node start at the head -- .find()
  // current node travels through list until it finds item -- .find()
  // if current node = item, make new node, set new node point to item
  // set next pointer of the previous node to the new node
  if (!this.head) {
    return null;
  }

  let currNode = this.head;
  let previousNode = this.head;

  while((currNode !== null) && (currNode.value !== item)) {
    previousNode = currNode;
    currNode = currNode.next;
  }
  if (currNode === null) {
    console.log('Item not found-insertBefore');
    return;
  }
  let newNode = new _Node (itemToAdd, currNode);
  previousNode.next = newNode;
}



module.exports = { displayList, size, isEmpty, findPrevious, findLast, remove, insertFirst, insertAt, insertBefore, insertLast }