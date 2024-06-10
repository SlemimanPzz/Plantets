class PlanetRing {
  /**
   */
  constructor(gl, material=new FlatMaterial(gl),  planetTranslate=identity, update = true, rotSpeed, planetSize) {
    this.material = material;

    this.toUpdate = update;
    this.rotSpeed = rotSpeed;
    this.rot = 0
    this.planetTranslate = planetTranslate;

     this.ringScale = Matrix4.scale(new Vector3(2*planetSize,0,2*planetSize))
    let ringTranslate =Matrix4.multiply(planetTranslate,  this.ringScale);

    this.transform = ringTranslate;
    this.iTransform = ringTranslate;


    let vertices = this.getVertices();
    let uv = this.getUVCoordinates();


    this.geometryVAO = gl.createVertexArray();
    gl.bindVertexArray(this.geometryVAO);

    //////////////////////////////////////////////////
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_position"));
    gl.vertexAttribPointer(this.material.getAttribute("a_position"), 3, gl.FLOAT, false, 0, 0);

    //////////////////////////////////////////////////
    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_texcoord"));
    gl.vertexAttribPointer(this.material.getAttribute("a_texcoord"), 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.num_elements = vertices.length/3;
  }

  toggleUpdate(){
    this.toUpdate = !this.toUpdate;
  }

  updateFalse() {
    this.toUpdate = false
  }

  updateTrue() {
    this.toUpdate = true
  }

  restart() {
    this.rot = 0;
    this.transform = this.iTransform;
    this.update(0, true)
  }

  updatePos(pos) {
    this.iTransform= Matrix4.multiply(pos,  this.ringScale);
    this.update(0, true)
  }

  updateScale(scale){
    this.ringScale = Matrix4.scale(new Vector3(2*scale,0,2*scale))
    this.iTransform =  Matrix4.multiply(this.planetTranslate, this.ringScale);
  }
    getThetaTranslation(elapse) {
    // Math.PI/30 = 30RPM = Math.PI * elapse con elapse aprox = 0.033
    return Math.PI * elapse/15
  }

  updateRotSpeed(rotSpeed) {
    this.rotSpeed = rotSpeed;
  }

  // Update esta hecho para que un año en la tierra sea 30 segundos
  update(elapsed, forceUpdate = false) {
    if (this.toUpdate || forceUpdate){
      this.transform = Matrix4.multiply(Matrix4.rotateY(this.rot += this.rotSpeed*this.getThetaTranslation(elapsed)), this.iTransform);
    }
  }

  /**
   */
  draw(gl, projectionMatrix, viewMatrix, light) {
    let viewModelMatrix = Matrix4.multiply(viewMatrix, this.transform);
    let projectionViewModelMatrix = Matrix4.multiply(projectionMatrix, viewModelMatrix);

    gl.useProgram(this.material.program);

    // u_PVM_matrix
    if (this.material.getUniform("u_PVM_matrix") != undefined) {
      gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix.toArray());
    }

    // u_texture
    if (this.material.getUniform("u_texture") != undefined) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
      gl.uniform1i(this.material.getUniform("u_texture"), 0);
    }
    ////////////////////////////////////////////////////////////


    gl.bindVertexArray(this.geometryVAO);
    gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);

    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /**
   */
  getVertices() {
    return [
      1, 0,  1,
      1, 0, -1,
     -1, 0,  1,

     -1, 0,  1,
      1, 0, -1,
     -1, 0, -1, 
    ];
  }

  /**
   */
  getNormals() {
    return [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    ];
  }
  /**
   */
  getUVCoordinates() {
    return [
      1, 0,
      1, 1,
      0, 0,

      0, 0,
      1, 1,
      0, 1, 
    ];
  }
}

