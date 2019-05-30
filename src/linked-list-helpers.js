function displayList(list){
  let currNode = list.head;
  while (currNode !== null) {
      console.log(currNode.value);
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

module.exports = { displayList, size, isEmpty, findPrevious, findLast }