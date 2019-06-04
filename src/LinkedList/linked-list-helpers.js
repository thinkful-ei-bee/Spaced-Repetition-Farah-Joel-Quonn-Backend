const LinkedListHelpers = {

displayList(list){
    let currNode = list.head;
    while (currNode !== null) {
        currNode = currNode.next;
    }
  },
  
size(list){
    let counter = 0;
    let currNode = list.head;
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
  },
  
isEmpty(list){
    let currNode = list.head;
    if(!currNode){
        return true;
    }
    else {
        return false;
    }
  },
  
findPrevious(list, item) {
    let currNode = list.head;
    while ((currNode !== null) && (currNode.next.value !== item)) {
        currNode = currNode.next;
    }
    return currNode;
  },
  
findLast(list){
    if(list.head === null){
        return 'list is empty';
    } 
    let tempNode = list.head;
    while(tempNode.next !== null){
        tempNode = tempNode.next;
    }
      return tempNode;
  },
  
 remove(item) {
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
  },
  
insertBefore(itemToAdd, item) {
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
}



module.exports = LinkedListHelpers;