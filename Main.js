// Es importante el async
window.addEventListener("load", async function(evt) {
  let canvas = document.getElementById("the_canvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) throw "WebGL no soportado";

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let texEarth = await loadImage("texturas/8k_earth_daymap.png");
    let texMercury = await loadImage("texturas/2k_mercury.png");
    let texVenus = await loadImage("texturas/2k_venus_surface.png")
    let texMarte = await loadImage("texturas/2k_mars.png");
    let texJupiter = await loadImage("texturas/2k_jupiter.png");
    let texSaturn = await loadImage("texturas/2k_saturn.png")
    let skyboxTex = await loadImage("texturas/2k_stars_milky_way.png");
    let saturnRing = await loadImage("texturas/saturn_ring.png")
    let texNeptune = await loadImage("texturas/2k_neptune.png")
    let texUranus = await loadImage("texturas/2k_uranus.png")

  function update(elapse) {
      geometry[0].update(camera.pos)
      for (let i=0; i<geometry.length; i++) {
          geometry[i].update(elapse);
      }
  }

    let initCameraPos = new Vector3(10, 20, 0)
    let initCameraCoi = new Vector3(10, -1, -1)
    let initCameraUp =   new Vector3(0, 1, 0)

  function planetPosAndRot(pos, theta) {
    return Matrix4.multiply(Matrix4.translate(new Vector3(pos, 0, 0)) ,Matrix4.rotateZ(theta))
  }

  let geometry = [
      //skybox
      new Skybox(gl, 500, 16, 16, new TextureMaterial(gl, skyboxTex)),
      //Sun
      new Sun(gl, sunSizeSmall, new FlatMaterial(gl, [.95,.7,.07,1]), Matrix4.translate(new Vector3(0, 0, 0))),
      // Anillo Saturno
      new PlanetRing(gl, new TextureAlphaMaterial(gl, saturnRing), planetPosAndRot(60, .45), true, saturnTranslate, saturnSize),
      // Mercurio
      new Planet(gl, mercurySize, new TexturedPhongMaterial(gl, texMercury, [0.1,0.1,0.1], [1,1,1], [0,0,0]), planetPosAndRot(5,0),
      mercuryRotate, mercuryTranslate, true),
      //Venus
      new Planet(gl, venusSize, new TexturedPhongMaterial(gl, texVenus, [0.1,0.1,0.1], [1,1,1], [0,0,0]),planetPosAndRot(7, 3.089),
          venusRotate, venusTranslate, true),
      // Tierra
      new Planet(gl, earthSize,  new TexturedPhongMaterial(gl, texEarth, [0.1,0.1,0.1], [1,1,1], [0,0,0]), planetPosAndRot(10, .45),
          earthRotate, earthTranslate),
      // Mars
      new Planet(gl, marsSize,  new TexturedPhongMaterial(gl, texMarte, [0.1,0.1,0.1], [1,1,1], [0,0,0]), planetPosAndRot(14, .44),
      marsRotate, marsTranslate),
      //Jupiter
      new Planet(gl, jupiterSize,  new TexturedPhongMaterial(gl, texJupiter, [0.1,0.1,0.1], [1,1,1], [0,0,0]),planetPosAndRot(30, .05),
          jupiterRotate, jupiterTranslate),
      //Saturn
      new Planet(gl, saturnSize,  new TexturedPhongMaterial(gl, texSaturn, [0.1,0.1,0.1], [1,1,1], [0,0,0]), planetPosAndRot(60, .45),
          saturnRotate, saturnTranslate),
      // Urano
      new Planet(gl, uranusSize,  new TexturedPhongMaterial(gl, texUranus, [0.1,0.1,0.1], [1,1,1], [0,0,0]), planetPosAndRot(80, 1.69),
          uranusRotate, uranusTranslate),
      // Neptune
      new Planet(gl, neptuneSize, new TexturedPhongMaterial(gl, texNeptune, [0.1,0.1,0.1], [1,1,1], [0,0,0]), planetPosAndRot(90, .49),
          neptuneRotate, neptuneTranslate),
  ];

    function createTextBoxes() {
        const container = document.getElementById('planet-controls');
        const divSun = document.createElement('div');
        divSun.classList.add('textbox-container');
        divSun.innerHTML = `
            <h3>Sun</h3>
            <div class="textbox-group">
                <label for="Sun-radius">Radius (Original ${sunSize})</label>
                <input type="text" id="Sun-radius" value="${sunSizeSmall}" step="0.01">
                <button id="sun-radius-but-small" class="menu-button">Reset to Small Size</button>
                <button id="sun-radius-but-big" class="menu-button">Reset to Real Size</button>
            </div>
        `;
        container.appendChild(divSun);
        for (let i = 0; i < originalValues.length; i++) {
            const planet = originalValues[i];
            const div = document.createElement('div');
            div.classList.add('textbox-container');
            div.innerHTML = `
            <h3>${planet.name}</h3>
            <div class="textbox-group">
                <label for="${planet.name}-radius">Radius (Original ${planet.radius})</label>
                <input type="text" id="${planet.name}-radius" value="${planet.radius}" step="0.01">
                <button id="${planet.name}-radius-but" class="menu-button">Reset</button>
            </div>
            <div class="textbox-group">
                <label for="${planet.name}-rotSpeed">Rotation Speed (Original ${planet.rotSpeed})</label>
                <input type="text" id="${planet.name}-rotSpeed" value="${planet.rotSpeed}" step="0.01">
                <button id="${planet.name}-rotSpeed-but" class="menu-button">Reset</button>
            </div>
            <div class="textbox-group">
                <label for="${planet.name}-tranSpeed">Translation Speed (Original ${planet.tranSpeed})</label>
                <input type="text" id="${planet.name}-tranSpeed" value="${planet.tranSpeed}" step="0.01">
                <button id="${planet.name}-tranSpeed-but" class="menu-button">Reset</button>
            </div>
            <div class="textbox-group">
            <label for="${planet.name}-orbitDist">Orbit Distance (Original ${planet.orbitDist})</label>
            <input type="text" id="${planet.name}-orbitDist" value="${planet.orbitDist}" step="0.01">
                <button id="${planet.name}-orbitDist-but" class="menu-button">Reset</button>
            </div>`;
            container.appendChild(div);
        }


    }

    function updatePlanetsFromTextBoxes() {
        const radius = parseFloat(document.getElementById(`Sun-radius`).value);
        if(!isNaN(radius)) {
            geometry[1].updateSize(radius)
        }
        for (let i = 0; i < originalValues.length; i++) {
            const planet = originalValues[i];
            const radius = parseFloat(document.getElementById(`${planet.name}-radius`).value);
            const rotSpeed = parseFloat(document.getElementById(`${planet.name}-rotSpeed`).value);
            const tranSpeed = parseFloat(document.getElementById(`${planet.name}-tranSpeed`).value);
            const orbitDist = parseFloat(document.getElementById(`${planet.name}-orbitDist`).value);

            if (!isNaN(radius) && !isNaN(rotSpeed) && !isNaN(tranSpeed)) {
                geometry[i + 3].updateSize(radius);
                geometry[i + 3].updateRotSpeed(rotSpeed);
                geometry[i + 3].updateTransSpeed(tranSpeed);
                geometry[i + 3].updatePos(planetPosAndRot(orbitDist, planet.planetRot))
            }
            //Actualizar Anillo de saturno
            if (i == 5) {
                geometry[2].updateScale(radius)
                geometry[2].updateRotSpeed(tranSpeed)
                geometry[2].updatePos(planetPosAndRot(orbitDist, planet.planetRot))
            }
        }
    }

    function resetSunSize() {
        document.getElementById('Sun-radius').value = sunSize;
        updatePlanetsFromTextBoxes();
    }
    function resetCamera() {
        camera.pos = initCameraPos;
        camera.coi = initCameraCoi;
        camera.up = initCameraUp;
        document.getElementById('cam-pos-x').value = initCameraPos.x;
        document.getElementById('cam-pos-y').value = initCameraPos.y;
        document.getElementById('cam-pos-z').value = initCameraPos.z;
        document.getElementById('cam-coi-x').value = initCameraCoi.x;
        document.getElementById('cam-coi-y').value = initCameraCoi.y;
        document.getElementById('cam-coi-z').value = initCameraCoi.z;
    }
    function setCamera() {
        const posX = parseFloat(document.getElementById('cam-pos-x').value);
        const posY = parseFloat(document.getElementById('cam-pos-y').value);
        const posZ = parseFloat(document.getElementById('cam-pos-z').value);
        const coiX = parseFloat(document.getElementById('cam-coi-x').value);
        const coiY = parseFloat(document.getElementById('cam-coi-y').value);
        const coiZ = parseFloat(document.getElementById('cam-coi-z').value);

        if (!isNaN(posX) && !isNaN(posY) && !isNaN(posZ) &&
            !isNaN(coiX) && !isNaN(coiY) && !isNaN(coiZ)) {
            camera.pos = new Vector3(posX, posY, posZ);
            camera.coi = new Vector3(coiX, coiY, coiZ);
        }
    }


    function setGlobalSpeed() {
        const globalMod = parseFloat(document.getElementById('speed').value)
        if (!isNaN(globalMod)) {
            for (let i = 0; i < originalValues.length; i++) {
                const planet = originalValues[i];
                document.getElementById(`${planet.name}-rotSpeed`).value *= globalMod;
                document.getElementById(`${planet.name}-tranSpeed`).value *= globalMod;
                if(i == 5) {
                    geometry[2].updateRotSpeed(parseFloat(document.getElementById(`${planet.name}-tranSpeed`).value))
                }
            }

        }
        document.getElementById('speed').value = 1
        updatePlanetsFromTextBoxes()
    }



    function setRealRelativeDistances(){
        pausePlanets();
        restartPlanets();
        let startValue = parseFloat(document.getElementById(`Earth-orbitDist`).value)
        for (let i = 0; i < originalValues.length; i++) {
            const planet = originalValues[i];
            document.getElementById(`${planet.name}-orbitDist`).value = startValue*realRelativeDistances[i];
        }
        updatePlanetsFromTextBoxes();
    }

    function resetPlanets() {
        for (let i = 0; i < originalValues.length; i++) {
            const planet = originalValues[i];
            document.getElementById(`${planet.name}-radius`).value = planet.radius;
            document.getElementById(`${planet.name}-rotSpeed`).value = planet.rotSpeed;
            document.getElementById(`${planet.name}-tranSpeed`).value = planet.tranSpeed;
            document.getElementById(`${planet.name}-orbitDist`).value = planet.orbitDist;
        }
        updatePlanetsFromTextBoxes();
    }

    function resetAll() {
        document.getElementById('Sun-radius').value = sunSizeSmall;
        resetPlanets();
        resetCamera();
    }

    function playPausePlanets() {
        for (let i=2; i<geometry.length; i++) {
            geometry[i].toggleUpdate();
        }
    }

    function restartPlanets() {
        for (let i=2; i<geometry.length; i++) {
            geometry[i].restart();
        }
    }

    function pausePlanets() {
        for (let i=2; i<geometry.length; i++) {
            geometry[i].updateFalse();
        }
    }

    function setCloseDistanceWithSmallSun(){
        document.getElementById('Sun-radius').value = sunSizeSmall;
        resetPlanets()
    }


    function setSunRealRelativeSize() {
        document.getElementById('Sun-radius').value = sunSize;
        for (let i = 0; i < originalValues.length; i++) {
            const planet = originalValues[i];
            document.getElementById(`${planet.name}-orbitDist`).value = bigSunCloseDistances[i];
            // Anillo de saturno
            if(i == 5) {
                geometry[2].updatePos(planetPosAndRot(bigSunCloseDistances[i], planet.planetRot))
            }
        }
        updatePlanetsFromTextBoxes()
        // Apuntar a la tierra
        camera.pos = new Vector3(120, 20, 0);
        camera.coi = new Vector3(119, -1, -1)
    }

    const style = document.createElement('style');
    style.innerHTML = `
    .planet-container {
        border: 1px solid #ccc;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
        background-color: #f9f9f9;
    }
    .textbox-group {
        margin-bottom: 10px;
    }
    .textbox-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .textbox-group input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .control-button {
        display: inline-block;
        margin: 10px 5px;
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .control-button:hover {
        background-color: #0056b3;
    }
`;
    document.head.appendChild(style);

    createTextBoxes();

    function addResetOnClicks() {

        document.getElementById('sun-radius-but-small').addEventListener('click', () => {
            document.getElementById('Sun-radius').value = sunSizeSmall;
            updatePlanetsFromTextBoxes()
        })
        document.getElementById('sun-radius-but-big').addEventListener('click', setSunRealRelativeSize)


        for (let i = 0; i < originalValues.length; i++) {
            let planet = originalValues[i];
            const resetRadius = function () {
                document.getElementById(`${planet.name}-radius`).value = planet.radius;
                updatePlanetsFromTextBoxes()
            };
            const resetRotacion = function () {
                document.getElementById(`${planet.name}-rotSpeed`).value = planet.rotSpeed;
                updatePlanetsFromTextBoxes()
            };
            const resetTranslation = function () {
                document.getElementById(`${planet.name}-tranSpeed`).value = planet.tranSpeed;
                updatePlanetsFromTextBoxes()
            };
            const restOrbit = function () {
                document.getElementById(`${planet.name}-orbitDist`).value = planet.orbitDist;
                updatePlanetsFromTextBoxes()
            };


            document.getElementById(`${planet.name}-radius-but`).addEventListener('click', resetRadius);
            document.getElementById(`${planet.name}-rotSpeed-but`).addEventListener('click', resetRotacion);
            document.getElementById(`${planet.name}-tranSpeed-but`).addEventListener('click', resetTranslation);
            document.getElementById(`${planet.name}-orbitDist-but`).addEventListener('click', restOrbit);
        }
    }

    addResetOnClicks()
    document.getElementById('planet-controls').addEventListener('input', updatePlanetsFromTextBoxes);
    document.getElementById('reset_planets').addEventListener('click', resetPlanets);
    document.getElementById('reset_cam').addEventListener('click', resetCamera);
    document.getElementById('reset_all').addEventListener('click', resetAll);
    document.getElementById('set_camera').addEventListener('click', setCamera);
    document.getElementById('Play_pause').addEventListener('click', playPausePlanets)
    document.getElementById('restart').addEventListener('click', restartPlanets)
    document.getElementById('reset_sun_move_planets').addEventListener('click', setSunRealRelativeSize)
    document.getElementById('real_relative_distance').addEventListener('click', setRealRelativeDistances)
    document.getElementById('close_and_small_sun').addEventListener('click', setCloseDistanceWithSmallSun)
    document.getElementById('speed-button').addEventListener('click', setGlobalSpeed)

    let camera = new MoveCamera(initCameraPos, initCameraCoi, initCameraUp);
    resetCamera();

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
        viewMatrix.multiplyVector(lightPosition);
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

  camera.registerMouseEvents(gl.canvas, draw);
  gameLoop();

    window.addEventListener("keydown", (evt) => {
        console.log(evt.key);

        if (evt.key == "ArrowUp") {
            camera.moveForward();
        }

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
});


