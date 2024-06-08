class Plano {
  /**
   */
  constructor(gl, material=new FlatMaterial(gl),  transform=identity, update = true, rotSpeed) {
    this.material = material;
    this.transform = transform;
    this.iTrnasform = transform;
    this.toUpdate = update;
    this.rotSpeed = rotSpeed;
    this.rot = 0

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

  getThetaTranslation(elapse) {
    // Math.PI/30 = 30RPM = Math.PI * elapse con elapse aprox = 0.033
    return Math.PI * elapse/15
  }

  update(elapsed) {
    if (this.toUpdate){
      this.transform = Matrix4.multiply(Matrix4.rotateY(this.rot += this.rotSpeed*this.getThetaTranslation(elapsed)), this.iTrnasform);
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
      gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix);
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

