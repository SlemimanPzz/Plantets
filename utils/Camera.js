class Camera {
  constructor(pos={x:0, y:0, z:1}, coi={x:0, y:0, z:0}, up={x:0, y:1, z:0}) {
    this.setPos(pos);
    this.setCOI(coi);
    this.setUp(up);

    this.m = new Matrix4();
  }

  setPos(pos) {
    this.pos = pos;
    this.needUpdate = true;
  }

  setCOI(coi) {
    this.coi = coi;
    this.needUpdate = true;
  }

  setUp(up) {
    this.up  = up;
    this.needUpdate = true;
  }

  getMatrix() {
    if (this.needUpdate) {
      this.needUpdate = false;
      this.m = Matrix4.lookAt(this.pos, this.coi, this.up)
    }
    return this.m;
  }
}
