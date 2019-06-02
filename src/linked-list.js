class _Node {
  constructor(value, next) {
      this.value=value,
      this.next=next;
  }
}

class LinkedList {
  constructor() {
      this.head = null;
  }

  insertFirst(item){
      this.head = new _Node(item, this.head);
  }

  insertLast(item){
      if(this.head === null){
          this.insertFirst(item);
      }
      else{
          let tempNode = this.head;
          while(tempNode.next !== null){
              tempNode = tempNode.next;
          }
          tempNode.next = new _Node(item, null);
      }
  }
  /**Inserts a new node after a node containing the key.*/
  insertAfter(key, itemToInsert){
      let tempNode = this.head;
      while(tempNode !== null && tempNode.value !== key){
          tempNode = tempNode.next;
      } 
      if(tempNode !== null){
          tempNode.next = new _Node(itemToInsert, tempNode.next);
      }  
  }
  /* Inserts a new node before a node containing the key.*/
  insertBefore(key, itemToInsert){
      if(this.head == null){
          return;
      }
      if(this.head.value == key){
          this.insertFirst(itemToInsert);
          return;
      }
      let prevNode = null;
      let currNode = this.head;
      while(currNode !== null && currNode.value !== key){
          prevNode = currNode;
          currNode = currNode.next;
      }
      if(currNode === null){
          console.log('Node not found to insert');
          return;
      }
      //insert between current and previous
      prevNode.next = new _Node(itemToInsert, currNode);
  }
  insertAt(itemToInsert, nthPosition) {
      if (this.head === null) {
          if (nthPosition === 1 ) {
              this.insertFirst(itemToInsert);
              return;
          } else {
              this.insertLast(itemToInsert);
              return;
          }
      }
      let currentPos = 1;
      let currNode = this.head;
      let prevNode = this.head;
      while (currentPos !== nthPosition && currNode !== null) {
          prevNode = currNode;
          currNode = currNode.next;
          currentPos;
      }
      if (currNode === null) {
          this.insertLast(itemToInsert)
      }
      let tempNode = currNode;
      prevNode.next = new _Node(itemToInsert, tempNode);
  }


  _findNthElement(position) {
      let node = this.head;
      for (let i=0; i<position; i++) {
          node = node.next;
      }
      return node;
  }
  remove(item){ 
      //if the list is empty
      if (!this.head){
          return null;
      }      
      //if the node to be removed is head, make the next node head
      if(this.head.value === item){
        this.head = this.head.next;
        return;
      }
      //start at the head
      let currNode = this.head;
      //keep track of previous
      let previousNode = this.head;
      while ((currNode !== null) && (currNode.value !== item)) {
          //save the previous node 
          previousNode = currNode;
          currNode = currNode.next;
      }
      if(currNode === null){
          console.log('Item not found');
          return;
      }
      previousNode.next = currNode.next;
  }
  find(item) { //get
      //start at the head
      let currNode = this.head;
      //if the list is empty
      if (!this.head){
          return null;
      }
      while(currNode.value !== item) {
          //return null if end of the list 
          // and the item is not on the list
          if (currNode.next === null) {
              return null;
          }
          else {
              //keep looking 
              currNode = currNode.next;
          }
      }
      //found it
      return currNode;
  }
}

module.exports = LinkedList