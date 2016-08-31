//Code from the open source github project "data-structures"
//from the user "tutsplus"
//https://github.com/tutsplus/data-structures


function Queue() {
  this._oldestIndex = 1;
  this._newestIndex = 1;
  this._storage     = {};
}

Queue.prototype.size = function() {
  return this._newestIndex - this._oldestIndex;
};

Queue.prototype.enqueue = function(data) {
  this._storage[this._newestIndex] = data;
  this._newestIndex++;
};

Queue.prototype.dequeue = function() {
  var oldestIndex = this._oldestIndex,
      newestIndex = this._newestIndex,
      deletedData;

  if (oldestIndex === newestIndex) {
    return;
  } else {  
    deletedData = this._storage[oldestIndex];
    delete this._storage[oldestIndex];
    this._oldestIndex++;

    return deletedData;
  }
};