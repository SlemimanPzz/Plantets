// Es importante el async
window.addEventListener("load", async function(evt) {
  let canvas = document.getElementById("the_canvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) throw "WebGL no soportado";

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let texEarth = await loadImage("texturas/8k_earth_daymap.png");
    let texMercurio = await loadImage("texturas/mercurio.png");
    let texMarte = await loadImage("texturas/mars.png");
    let texJupiter = await loadImage("texturas/2k_jupiter.png");
    let texSaturn = await loadImage("texturas/saturn.png")
    let skyboxTex = await loadImage("texturas/2k_stars_milky_way.png");
    let saturnRing = await loadImage("texturas/saturn_ring.png")
    let texNeptune = await loadImage("texturas/2k_neptune.png")

    let earthSize = 1;       // Earth's diameter
    let earthRotate = 1;     // Earth's rotation period (length of day)
    let earthTranslate = 1;  // Earth's orbital period (year)

    let sunSize = 109 * earthSize;

// Mercury
    let mercurySize = 0.383 * earthSize;
    let mercuryRotate = 175.9416666667 * earthRotate;
    let mercuryTranslate = 4.147 * earthTranslate;

// Venus
    let venusSize = 0.949 * earthSize;
    let venusRotate = 116.75 * earthRotate;
    let venusTranslate = -1.622 * earthTranslate;

// Moon
    let moonSize = 0.2724 * earthSize;
    let moonRotate = 29.5 * earthRotate;
    let moonTranslate = 0.0748 * earthTranslate;

// Mars
    let marsSize = 0.532 * earthSize;
    let marsRotate = 1.02916666667 * earthRotate;
    let marsTranslate = 0.531 * earthTranslate;

// Jupiter
    let jupiterSize = 11.21 * earthSize;
    let jupiterRotate = 0.4125 * earthRotate;
    let jupiterTranslate = 0.08423724902 * earthTranslate;

// Saturn
    let saturnSize = 9.45 * earthSize;
    let saturnRotate = 0.4458333333 * earthRotate;
    let saturnTranslate = 0.03392508597 * earthTranslate;

// Uranus
    let uranusSize = 4.01 * earthSize;
    let uranusRotate = 17.2 * earthRotate;
    let uranusTranslate = 0.01189428748 * earthTranslate;

// Neptune
    let neptuneSize = 3.88 * earthSize;
    let neptuneRotate = 16.1 * earthRotate;
    let neptuneTranslate = 0.0061 * earthTranslate;


  function update(elapse) {
      geometry[0].update(camera.pos)
      for (let i=2; i<geometry.length; i++) {
          geometry[i].update(elapse);
      }
  }


  let geometry = [
      //skybox
      new Skybox(gl, 500, 16, 16, new TextureMaterial(gl, skyboxTex)),
      //Sun
      new Sun(gl, earthSize*2,16,16, new FlatMaterial(gl, [1,1,1,1]), Matrix4.translate(new Vector3(0, 0, 0))),
      // Mercurio
      new Planet(gl, mercurySize, 16, 16, new TexturedPhongMaterial(gl, texMercurio, [0.1,0.1,0.1], [1,1,1], [0,0,0]), Matrix4.translate(new Vector3(5, 0, 0)),
      mercuryRotate, mercuryTranslate, true),
      //Venus
      new Planet(gl, venusSize, 16, 16, new TexturedPhongMaterial(gl, texMercurio, [0.1,0.1,0.1], [1,1,1], [0,0,0]), Matrix4.translate(new Vector3(7.5, 0, 0)),
          venusRotate, venusTranslate, true),
      // Tierra
      new Planet(gl, earthSize, 16, 16, new TexturedPhongMaterial(gl, texEarth, [0.1,0.1,0.1], [1,1,1], [0,0,0]), Matrix4.translate(new Vector3(10, 0, 0)),
          earthRotate, earthTranslate),
      // Mars
      new Planet(gl, marsSize, 16, 16, new TexturedPhongMaterial(gl, texMarte, [0.1,0.1,0.1], [1,1,1], [0,0,0]), Matrix4.translate(new Vector3(14, 0, 0)),
      marsRotate, marsTranslate),
      //Jupiter
      new Planet(gl, jupiterSize, 16, 16, new TexturedPhongMaterial(gl, texJupiter, [0.1,0.1,0.1], [1,1,1], [0,0,0]), Matrix4.translate(new Vector3(40, 0, 0)),
          jupiterRotate, jupiterTranslate),
      //Saturn
      new Planet(gl, saturnSize, 16, 16, new TexturedPhongMaterial(gl, texSaturn, [0.1,0.1,0.1], [1,1,1], [0,0,0]), Matrix4.translate(new Vector3(60, 0, 0)),
          saturnRotate, saturnTranslate),
      // Anillo
      // new Plano(gl, new TextureAlphaMaterial(gl, saturnRing),Matrix4.translate(new Vector3(60, 0, 0)), true, saturnTranslate),
      // Urano
      //new Planet(gl, uranusSize, 16, 16, new TexturedPhongMaterial(gl, texSaturn, [0.1,0.1,0.1], [1,1,1], [0,0,0]), Matrix4.translate(new Vector3(20, 0, 0)),
      //    uranusRotate, uranusTranslate),
      // Neptune
      new Planet(gl, neptuneSize, 16, 16, new TexturedPhongMaterial(gl, texNeptune, [0.1,0.1,0.1], [1,1,1], [0,0,0]), Matrix4.translate(new Vector3(80, 0, 0)),
          neptuneRotate, neptuneTranslate),
  ];

  let camera = new MoveCamera(
    new Vector3(0, 25, 1),
    new Vector3(0, 0, 0),
    new Vector3(0, 1, 0),
  );
  
  let projectionMatrix = Matrix4.perspective(75*Math.PI/180, canvas.width/canvas.height, 1, 2000);

  let lightPosition = new Vector4(0,0,0,1);

  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  
  function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let viewMatrix = camera.getMatrix();
    let trans_lightPosition = viewMatrix.multiplyVector(lightPosition);

    for (let i=0; i<geometry.length; i++) {

      let light =
          {
            position : viewMatrix.multiplyVector(lightPosition),
            color : [1,1,1],
            colorD : [1,1,1],
            colorS : [1,1,1]
          }
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

  let lastTime = Date.now();
  let current = 0;
  let elapsed = 0;
  let max_elapsed_wait = 33/1000;
  function gameLoop() {
    current = Date.now();
    elapsed = (current - lastTime) / 1000;
    lastTime = current;

    if (elapsed > max_elapsed_wait) {
      elapsed = max_elapsed_wait;
    }

    update(elapsed);
    draw();

    window.requestAnimationFrame(gameLoop);
  }

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);
  gameLoop();


    window.addEventListener("keydown", (evt) => {
        console.log(evt.key);

        // tecla hacia arriba
        if (evt.key == "ArrowUp") {
            camera.moveForward();
        }
        // tecla hacia abajo
        if (evt.key == "ArrowDown") {
            camera.moveBackward();
        }

        if (evt.key == "w" || evt.key == "W") {
            camera.moveForward();
        }

        if (evt.key == "s" || evt.key == "S") {
            camera.moveBackward()
        }

    });

    document.getElementById('reset_camera_pos').addEventListener('click', () => {
            camera.pos = new Vector3(0, 25, 1);
             camera.coi = new Vector3(0, 0, 0);
            camera.up = new Vector3(0, 1, 0);
    });
    document.getElementById('button2').addEventListener('click', () => buttonAction('Button 2'));
    document.getElementById('button3').addEventListener('click', () => buttonAction('Button 3'));
  //draw()
});