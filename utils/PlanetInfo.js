let earthSize = 1;       // Earth's diameter
let earthRotate = .5;     // Earth's rotation period (length of day)
let earthTranslate = .5;  // Earth's orbital period (year)

let sunSizeSmall = 3*earthSize;
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


const realRelativeDistances = {
    Mercury: 0.39,
    Venus: 0.72,
    Earth: 1,
    Mars: 1.52,
    Jupiter: 5.2,
    Saturn: 9.54,
    Uranus: 19.2,
    Neptune: 30.06
};

const closeDistances = [4, 7, 10,14, 30, 60, 80, 90];
const bigSunCloseDistances = closeDistances.map( value => value+109);

const originalValues = [
    { name: 'Mercury', radius: mercurySize, rotSpeed: mercuryRotate, tranSpeed: mercuryTranslate, orbitDist: 5, planetRot : 0},
    { name: 'Venus', radius: venusSize, rotSpeed: venusRotate, tranSpeed: venusTranslate, orbitDist : 7, planetRot: 3.089 },
    { name: 'Earth', radius: earthSize, rotSpeed: earthRotate, tranSpeed: earthTranslate, orbitDist : 10, planetRot: .45 },
    { name: 'Mars', radius: marsSize, rotSpeed: marsRotate, tranSpeed: marsTranslate, orbitDist : 14, planetRot: 44},
    { name: 'Jupiter', radius: jupiterSize, rotSpeed: jupiterRotate, tranSpeed:  jupiterTranslate, orbitDist : 30, planetRot: .05 },
    { name: 'Saturn', radius: saturnSize, rotSpeed:  saturnRotate, tranSpeed:  saturnTranslate, orbitDist : 60, planetRot: .45 },
    { name: 'Uranus', radius: uranusSize, rotSpeed: uranusRotate, tranSpeed: uranusTranslate, orbitDist : 80, planetRot: 1.69 },
    { name: 'Neptune', radius: neptuneSize, rotSpeed: neptuneRotate, tranSpeed:  neptuneTranslate, orbitDist : 90, planetRot: .49 }
];