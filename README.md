# Solar System

## Textures

Textures obtained from [Solar Textures](https://www.solarsystemscope.com/textures/)

### Planetary Data
The data for planetary orbits and rotations were sourced from [NASA Planetary Facts](https://nssdc.gsfc.nasa.gov/planetary/planetfact.html).

> **NOTE: Circular orbits are being used; in reality, orbits are elliptical. Additionally, the speed of the planets is constant, whereas in reality, it varies.**

## Development

The project was developed entirely using **JavaScript** and **WebGL**, without relying on any external libraries for mathematical, matrix, or vector operations. All calculations, including transformations, rotations, and projections, were custom-implemented to ensure complete control over the rendering process and to provide a deeper understanding of the mechanics involved.

The development focused primarily on circle geometry, with modifications and adjustments made as necessary. Plane geometry was also added for Saturn's rings.

### What is displayed

The solar system is initially shown with the planets at their real relative sizes. On the left, there is a menu to control the planets, and on the right, there is a button to access more general controls and some extras.  
The planets rotate on their real axes of rotation; for instance, the Earth is tilted at 23°, and Uranus is tilted at nearly 90°. The planets are displayed in order.

### Features

- Adjust the Sun's size as desired.
- A button to quickly set everything, including the Sun, to their real relative sizes, move the planets out of the Sun, and point the camera at Earth.
- Control the four main attributes of the planets: size, rotation speed, translation speed, and orbit. The middle two are relative to Earth.
- Reset the camera to its original position.
- Reset all planet values to their initial settings.
- Position the camera using provided data.
- Reset everything to the initial state.
- Pause or resume the animation.
- Reset the position of the planets.
- A button to switch distances to their true relative values, based on Earth as 1.
- Another button to group the planets.
- Change the global speed, making everything rotate and translate faster.
- Move the camera forward using W/UpArrow and backward with S/DownArrow.
- Adjust where the camera is pointing using the mouse + Click.
