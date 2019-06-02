const listHelpers = require('../linked-list-helpers')
const ll = require('../linked-list');

function buildList(list, language) {  
  let linkedList = new ll();

  let currNode = list.find(word => word.id === language.head);
  linkedList.insertLast(currNode);
  
  while(currNode.next !== null) {
    currNode = list.find(word => word.id === currNode.next);
    linkedList.insertLast(currNode);
  }
  return linkedList;
}

function display(list) {
  listHelpers.displayList(list);
  
}

function findIndex(list, item) {
  let currNode = list.head;
  let count = 0;

  if (!list.head) {
    return null;
  }

  while (currNode.value !== item) {
    if (currNode.next === null) {
      return null;
    } else {
      currNode = currNode.next;
    }
    count++;
  }
  return count;
}

function getTotal(list) {
  let currNode = list.head;
  let count = 0;

  if (!list.head) {
    return null;
  }

  while (currNode.next !== null) {
    currNode = currNode.next;
    count++;
  }
  return count;
}

function moveListItem(list, listItem) {

// list.head = list.head.next;
  // if(moveToIndex > listCount) {
  //   moveToIndex = listCount
  // }
  
  list.remove(listItem)
  list.head = list.head.next;
  list.insertLast(listItem)
console.log("our list:", list)
  return list
}

module.exports = { buildList, display, moveListItem, getTotal }