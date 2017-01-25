const LEFT = 0
const RIGHT = 1
module.exports = class PLRUCache {
  constructor(size){
    this.size = size
    this.items = []
    this.build()
  }
  build(){
    let trees = []
    let limit = this.size
    for(let i = 0; i < limit; i += 2){
      trees.push(new Tree(i, i+1)) // [(0, 1), (2, 3), (4, 5), (6, 7)]
    }
    limit = limit/2
    while(limit > 2){
      let counter = 0
      for(let i = 0; i < limit; i += 2){
        let temp = trees[i]
        trees[counter] = new Tree(temp, trees[i+1])
        counter++
      }
      limit = limit/2
    }
    this.root = new Tree(trees[0], trees[1])
  }
  insert(item){
    let pointer = this.root
    while(pointer instanceof Tree){
      let temp = pointer
      pointer = pointer[pointer.pos]
      temp.pos = temp.pos === LEFT ? RIGHT : LEFT
    }
    this.items[pointer] = item
  }
  getById(id){
    for(let i = 0, l = this.items.length; i<l; i++){
      if(this.items[i] && this.items[i]._id && this.items[i]._id === id){
        return this.items[i]
      }
    }
    return null
  }
}

class Tree {
  constructor(left, right){
    this.pos = LEFT
    this[LEFT] = left
    this[RIGHT] = right
  }
}
