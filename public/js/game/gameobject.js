const vertexLength = 8;

const GameObject = function(width, height) {
  this.vertexData = new Int16Array(vertexLength);
  this.colorData = new Float32Array(4);
  this.width = width;
  this.height = height;
  this.rgba = [1, 1, 1, 1];
}

Object.defineProperties(GameObject.prototype, {
  width: {
    get() {return this.vertexData[0]},
    set(n) {this.vertexData[0] = n}
  },
  height: {
    get() {return this.vertexData[1]},
    set(n) {this.vertexData[1] = n}
  },
  x: {
    get() {return this.vertexData[2]},
    set(n) {this.vertexData[2] = n}
  },
  y: {
    get() {return this.vertexData[3]},
    set(n) {this.vertexData[3] = n}
  },
  rx: {
    get() {return this.vertexData[4]},
    set(n) {this.vertexData[4] = n % 360}
  },
  ry: {
    get() {return this.vertexData[5]},
    set(n) {this.vertexData[5] = n % 360}
  },
  rz: {
    get() {return this.vertexData[6]},
    set(n) {this.vertexData[6] = n % 360}
  },
  drawX: {
    get() {return this.vertexData[7]},
    set(n) {this.vertexData[7] = n}
  },
  drawY: {
    get() {return this.vertexData[8]},
    set(n) {this.vertexData[8] = n}
  },
  rgba: {
    get() {return this.colorData.subarray(0, 4)},
    set(n) {this.colorData.set(n)}
  }
})

export default GameObject
export vertexLength;
