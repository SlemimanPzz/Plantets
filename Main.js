// Es importante el async
window.addEventListener("load", async function(evt) {
  let canvas = document.getElementById("the_canvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) throw "WebGL no soportado";

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let texEsfera = await loadImage("texturas/esfera.png");
    let texIcosaedro = await loadImage("texturas/icosaedro.png");
    let texPrismaRectangular = await loadImage("texturas/prisma_rectangular.png")
    let texTetraedro = await  loadImage("texturas/tetraedro.png")
    let texOctaedro = await  loadImage("texturas/octaedro.png")
    let texCilindro = await loadImage("texturas/cilindro.png")
    let texCono = await loadImage("texturas/cono.png")
    let texDodecaedro = await loadImage("texturas/dodecaedro.png")
    let texToroide = await  loadImage("texturas/toroide.png")


  let geometry = [
        new Esfera(gl, 2, 16, 16, new TextureMaterial(gl, texEsfera), Matrix4.translate(new Vector3(-5, 0, 0))),
        new Icosaedro(gl, 1, new TextureMaterial(gl, texIcosaedro), Matrix4.translate(new Vector3(0, 0, 0))),
  ];

  let camera = new OrbitCamera(
    new Vector3(0, 10, 7),
    new Vector3(0, -2, 0),
    new Vector3(0, 1, 0),
  );
  
  let projectionMatrix = Matrix4.perspective(75*Math.PI/180, canvas.width/canvas.height, 1, 2000);

  let lightPosition = new Vector4(5,5,5,1);

  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  
  function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let viewMatrix = camera.getMatrix();
    let trans_lightPosition = viewMatrix.multiplyVector(lightPosition);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw( 
        gl,
        projectionMatrix, 
        viewMatrix, 
        {
          pos: [
            trans_lightPosition.x,
            trans_lightPosition.y,
            trans_lightPosition.z
          ], 
          ambient: [0.2,0.2,0.2],
          diffuse: [1,1,1],
          especular: [1,1,1]
        }
      );
    }
  }

    // la cámara registra su manejador de eventos
    camera.registerMouseEvents(gl.canvas, draw);
  draw()
});