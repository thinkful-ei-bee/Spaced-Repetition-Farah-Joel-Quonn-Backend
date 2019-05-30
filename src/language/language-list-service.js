const listHelpers = require('../linked-list-helpers')

function buildList(list) {
  const words = [
    'zhōu',
    'nián',
    'jīntiān',
    'míngtiān',
    'zuótiān',
    'rìlì',
    'miǎo',
    'xiǎoshí',
    'fēnzhōng',
    'zhōngbiǎo'
  ]
  
  if (list.head === null) {
    words.forEach(word => {
      list.insertLast(word)
    });
  }

  return list
}

// have to know current position of item in list
// then move back M spaces

function display(list) {
  listHelpers.displayList(list);
  console.log(findIndex(list, 'nián'))
  //console.log(list)
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

module.exports = { buildList, display }