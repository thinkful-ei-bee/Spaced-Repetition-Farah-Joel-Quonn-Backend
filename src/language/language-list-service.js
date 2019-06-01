const listHelpers = require('../linked-list-helpers')

function buildList(list, words) {
  // const words = [
  //   'zhōu',
  //   'nián',
  //   'jīntiān',
  //   'míngtiān',
  //   'zuótiān',
  //   'rìlì',
  //   'miǎo',
  //   'xiǎoshí',
  //   'fēnzhōng',
  //   'zhōngbiǎo'
  // ]
  
  if (list.head === null) {
    
    words.forEach(word => {
      list.insertLast(word)
    });
  }

  // console.log("list from lls",list)
  return list
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