class Planet {
    /**
     */
    constructor(gl, radius=1, material=new FlatMaterial(gl), transform=identity
    , rotSpeed = 1, transSpeed = 1, update = true) {
        this.material = material;
        this.transform = transform;
        this.iTransform = transform;
        this.rotSpeed = rotSpeed;
        this.transSpeed = transSpeed;
        this.toUpdate = update;
        this.gl = gl

        this.r = radius;
        this.Nu = 32;
        this.Nv = 32;

        this.translacion = 0;
        this.rotacion = 0;
        this.init(gl);
    }

    /**
     */
    init(gl) {
        this.vertices = this.getVertices();

        if (this.getFaces) {
            this.faces = this.getFaces();
            this.createSmoothVAO(gl);
        }
    }

    updatePos(pos) {
        this.iTransform = pos
    }


    updateSize(scale){
        this.r = scale
        this.init(this.gl)
    }

    updateRotSpeed(rotSpeed){
        this.rotSpeed = rotSpeed
    }
    updateTransSpeed(transSpeed) {
        this.transSpeed = transSpeed
    }

    getThetaTranslation(elapse) {
        // Math.PI/30 = 30RPM = Math.PI * elapse con elapse aprox = 0.033
        return Math.PI * elapse/15
    }

    getThetaRotacion(elapse) {
        // Genera 365 rotaciones cada 30 segundos
        return 2*Math.PI * elapse * 12.1666666667
    }


    // Update esta hecho para que un año en la tierra sea 30 segundos
    update(elapsed) {
        if (this.toUpdate){
            let rot = Matrix4.rotateY(this.rotacion += this.getThetaRotacion(elapsed)/this.rotSpeed);
            let inter = Matrix4.multiply(this.iTransform, rot);
            this.transform = Matrix4.multiply(Matrix4.rotateY(this.translacion += this.transSpeed*this.getThetaTranslation(elapsed)), inter);
        }
    }

    /**
     */
    createSmoothVAO(gl) {
        this.smoothVAO = gl.createVertexArray();
        gl.bindVertexArray(this.smoothVAO);

        //////////////////////////////////////////////////
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.material.getAttribute("a_position"));
        gl.vertexAttribPointer(this.material.getAttribute("a_position"), 3, gl.FLOAT, false, 0, 0);

        //////////////////////////////////////////////////
        if (this.material.getAttribute("a_normal") != undefined) {
            let normals = this.getSmoothNormals(this.vertices, this.faces);
            let normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.material.getAttribute("a_normal"));
            gl.vertexAttribPointer(this.material.getAttribute("a_normal"), 3, gl.FLOAT, false, 0, 0);
        }

        //////////////////////////////////////////////////
        if ((this.getUVCoordinates) && (this.material.getAttribute("a_texcoord") != undefined)) {
            let uv = this.getUVCoordinates(this.vertices);
            let uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.material.getAttribute("a_texcoord"));
            gl.vertexAttribPointer(this.material.getAttribute("a_texcoord"), 2, gl.FLOAT, false, 0, 0);
        }

        //////////////////////////////////////////////////
        let indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);


        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


        this.num_smooth_elements = this.faces.length;
    }


    /**
     */
    draw(gl, projectionMatrix, viewMatrix, light) {
        let viewModelMatrix = Matrix4.multiply(viewMatrix, this.transform);
        let projectionViewModelMatrix = Matrix4.multiply(projectionMatrix, viewModelMatrix);

        gl.useProgram(this.material.program);

        // u_VM_matrix
        if (this.material.getUniform("u_VM_matrix") != undefined) {
            gl.uniformMatrix4fv(this.material.getUniform("u_VM_matrix"), true, viewModelMatrix.toArray());
        }
        // u_PVM_matrix
        if (this.material.getUniform("u_PVM_matrix") != undefined) {
            gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix.toArray());
        }

        ////////////////////////////////////////////////////////////
        // Componentes de la luz
        ////////////////////////////////////////////////////////////
        // u_light.position
        if (this.material.getUniform("u_light.position") != undefined) {
            gl.uniform3fv(this.material.getUniform("u_light.position"), light.pos);
        }
        // u_light.La
        if (this.material.getUniform("u_light.La") != undefined) {
            gl.uniform3fv(this.material.getUniform("u_light.La"), light.ambient);
        }
        // u_light.Ld
        if (this.material.getUniform("u_light.Ld") != undefined) {
            gl.uniform3fv(this.material.getUniform("u_light.Ld"), light.diffuse);
        }
        // u_light.Ls
        if (this.material.getUniform("u_light.Ls") != undefined) {
            gl.uniform3fv(this.material.getUniform("u_light.Ls"), light.especular);
        }
        ////////////////////////////////////////////////////////////


        ////////////////////////////////////////////////////////////
        // Componentes del material
        ////////////////////////////////////////////////////////////
        // u_material.Ka
        if (this.material.getUniform("u_material.Ka") != undefined) {
            gl.uniform3fv(this.material.getUniform("u_material.Ka"), this.material.Ka);
        }
        // u_material.Kd
        if (this.material.getUniform("u_material.Kd") != undefined) {
            gl.uniform3fv(this.material.getUniform("u_material.Kd"), this.material.Kd);
        }
        // u_material.Ks
        if (this.material.getUniform("u_material.Ks") != undefined) {
            gl.uniform3fv(this.material.getUniform("u_material.Ks"), this.material.Ks);
        }
        // u_material.shininess
        if (this.material.getUniform("u_material.shininess") != undefined) {
            gl.uniform1f(this.material.getUniform("u_material.shininess"), this.material.shininess);
        }
        // u_material.color
        if (this.material.getUniform("u_material.color") != undefined) {
            gl.uniform4fv(this.material.getUniform("u_material.color"), this.material.color);
        }
        // u_color
        if (this.material.getUniform("u_color") != undefined) {
            gl.uniform4fv(this.material.getUniform("u_color"), this.material.color);
        }
        // u_texture
        if (this.material.getUniform("u_texture") != undefined) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
            gl.uniform1i(this.material.getUniform("u_texture"), 0);
        }
        ////////////////////////////////////////////////////////////


        // Smooth shading
        gl.bindVertexArray(this.smoothVAO);
        gl.drawElements(gl.TRIANGLES, this.num_smooth_elements, gl.UNSIGNED_SHORT, 0);

        gl.bindVertexArray(null);
    }

    /**
     */
    getSmoothNormals(vertices, faces) {
        let normals = new Array(vertices.length);
        normals.fill(0);

        let v1, v2, v3;
        let i1, i2, i3;
        let tmp;
        let n;

        for (let i=0; i<faces.length; i+=3) {
            i1 = faces[i  ]*3;
            i2 = faces[i+1]*3;
            i3 = faces[i+2]*3;

            v1 = { x: vertices[i1], y: vertices[i1 + 1], z: vertices[i1 + 2] };
            v2 = { x: vertices[i2], y: vertices[i2 + 1], z:vertices[i2 + 2] };
            v3 = { x: vertices[i3], y: vertices[i3 + 1], z: vertices[i3 + 2] };

            n = (Vector3.cross(Vector3.subtract(v1, v2), Vector3.subtract(v2, v3))).normalize();

            tmp = { x: normals[i1], y: normals[i1+1], z: normals[i1+2] };
            tmp = Vector3.add(tmp, n);
            normals[i1  ] = tmp.x;
            normals[i1+1] = tmp.y;
            normals[i1+2] = tmp.z;


            tmp = { x: normals[i2], y: normals[i2+1], z: normals[i2+2] };
            tmp = Vector3.add(tmp, n);
            normals[i2  ] = tmp.x;
            normals[i2+1] = tmp.y;
            normals[i2+2] = tmp.z;


            tmp = { x: normals[i3], y: normals[i3+1], z: normals[i3+2] };
            tmp = Vector3.add(tmp, n);
            normals[i3  ] = tmp.x;
            normals[i3+1] = tmp.y;
            normals[i3+2] = tmp.z;
        }

        for (let i=0; i<normals.length; i+=3) {
            tmp = new Vector3(normals[i], normals[i+1], normals[i+2]).normalize();
            normals[i  ] = tmp.x;
            normals[i+1] = tmp.y;
            normals[i+2] = tmp.z;
        }

        return normals;
    }


    /**
     */
    getVertices() {
        let vertices = [];
        let phi;
        let theta;

        vertices.push(0, this.r, 0);

        for (let i=0; i<this.Nu; i++) {
            phi = Math.PI/2 - (i+1)*(Math.PI/(this.Nu+1));

            for (let j=0; j<this.Nv; j++) {
                theta = j*(2*Math.PI/this.Nv);

                vertices.push(
                    this.r * Math.cos(phi) * Math.cos(theta),
                    this.r * Math.sin(phi),
                    this.r * Math.cos(phi) * Math.sin(theta)
                );
            }
        }

        vertices.push(0, -this.r, 0);

        return vertices;
    }

    /**
     */
    getFaces() {
        let faces = [];

        for (let i=0; i<this.Nv; i++) {
            faces.push(
                0,
                ((i+1)%this.Nv)+1,
                (i%this.Nv)+1,
            );
        }

        for (let i=0; i<this.Nu-1; i++) {
            for (let j=0; j<this.Nv; j++) {
                faces.push(
                    j+1 + i*this.Nv,
                    (j+1)%this.Nv +1 + i*this.Nv,
                    (j+1)%this.Nv +1 + (i+1)*this.Nv,
                    j+1 + i*this.Nv,
                    (j+1)%this.Nv +1 + (i+1)*this.Nv,
                    j+1 + (i+1)*this.Nv,
                );
            }
        }

        for (let i=0; i<this.Nv; i++) {
            faces.push(
                this.vertices.length/3-1,
                this.vertices.length/3-1 -this.Nv +i,
                this.vertices.length/3-1 -this.Nv +((i+1)%this.Nv)
            );
        }

        return faces;
    }

    getUVCoordinates(vertices, isFlat) {
        let uv = [];

        let PI2 = Math.PI*2;

            let p;

            for (let i=0, l=vertices.length/3; i<l; i++) {
                p = new Vector3(vertices[i*3], vertices[i*3 +1],vertices[i*3 +2]).normalize();

                let u = 0.5 + (Math.atan2(p.x, p.z) / PI2) // U
                let v = 0.5 + (Math.asin(p.y) / Math.PI) // V
                uv.push(u,v);
            }

        return uv;
    }
}
