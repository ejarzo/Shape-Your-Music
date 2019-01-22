# Shape Your Music
_A geometric sequencer._

[https://ejarzo.github.io/Shape-Your-Music/](https://ejarzo.github.io/Shape-Your-Music/)

![Project](https://github.com/ejarzo/Shape-Your-Music/blob/master/src/static/img/readme_images/project_screenshot.png)

## About

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Geoboard.JPG/1280px-Geoboard.JPG" alt="drawing" width="100px"/>

Shape Your Music is a musical [geoboard](https://en.wikipedia.org/wiki/Geoboard) that explores a new way of composing and performing music using geometry.

It allows you to create melodic loops by drawing shapes. When a shape plays, a node traverses the perimeter of the shape at a constant speed, sounding a note at each vertex. Thus each edge represents a note. The first note of a shape is determined by the shape's `y` position on the plane. The note for each subsequent edge is determined by the angle between that edge and the previous edge. This angle determines the musical interval between the two notes(edges). For example: A sharp right turn means that the next note is much higher than the previous, while a shallow left turn means that the next note is a little lower. When the last point is reached, the loop starts again.

Using this app, one can:
- Draw multiple shapes to generate unique polyrhythms
- Move shapes up or down to transpose them within the scale, or side to side to move them in stereo space
- Manipulate shapes in real time to improvise and perform 
- Change and adjust the sound that each color produces
- Experiment with different musical modes, keys, and tempos
- Use grid and syncing options to create defined rhythms and loops
- Record and export your project as an audio file (export to MIDI coming soon)

[Read more](https://ejarzo.github.io/#sym)

This is the third iteration of this project. The [original](https://github.com/ejarzo/sym_v2), was written in vanilla JS/jQuery!

-----------

## User Manual

### Overview
Sound is created by drawing shapes on the canvas and clicking PLAY. There are two modes: DRAW and EDIT. While in DRAW mode, clicking on the canvas allows you to draw polygons by placing vertices. Each polygon represents a musical melody. In EDIT mode, you can adjust each polygon by dragging its vertices, or by dragging the entire polygon to a new position. Shapes higher up on the canvas start at higher notes than shapes lower down. Moving shapes left or right places them in stereo space (left/right on your speakers or headphones). Also in EDIT mode, you can click on a shape to display a context menu with more options. This menu allows you to change the color, reverse the playback direction, double or half the size, and control the volume of the shape. You can also solo, mute, or delete the shape from this menu.

Each shape is a certain color. The current color with which you are drawing is controlled with the color palette in the toolbar. A shape's color determines which instrument it uses to produce sound. The sounds for each color can be controlled with the colored panels at the bottom of the screen; if the red panel is set to the "Cello" instrument, every red shape will make a cello sound. These panels allow you to select a sound for each color and fine-tune that sound using the four knobs.

### Toolbar ![Toolbar](https://github.com/ejarzo/Shape-Your-Music/blob/master/src/static/img/readme_images/toolbar.png)
The toolbar allows you to adjust various aspects of your project.

#### Transport
| Name          | Description       |
| ------------- | ----------------- |
| Play/Stop     | Pressing play starts all shapes at their origin point. A shape plays in the order that it was drawn. |
| Record        | Pressing record allows you to download your project as an audio file (.wav). If playback is stopped when you click record, recording will begin when you begin playback. If the project is playing when you click record, the recording will start instantly. Pressing stop or record again will end the recording and show a window where you can listen and download the file that was generated. |

#### Drawing
| Name          | Description       |
| ------------- | ----------------- |
| Color         | Select the color of the shapes you are drawing. Different colored shapes produce different sounds. |
| Draw          | Draw mode allows you to create shapes. Click to place vertices. Click on the origin point to complete a shape. Right click to cancel. |
| Edit          | Edit mode allows you to adjust your shapes. Drag vertices to edit the perimeter of your shape. Drag the whole shape to move it. Click on a shape to show more detailed options (see shape controls). |

#### Canvas
| Name          | Description       |
| ------------- | ----------------- |
| Grid          | When selected, the grid is shown |
| Snap To Grid  | When selected, all points will snap to the grid when drawn, or when shapes are moved |
| Sync          | When selected, shapes will snap and lock to the same length - so that they will loop at the same time. Shapes can be “halved’ or “doubled” so that they loop half or twice as often. This allows for a defined rhythm. |
| Fullscreen    | Toggle Fullscreen |
| Clear         | Delete all shapes |

#### Music
| Name          | Description       |
| ------------- | ----------------- |
| Tempo         | Change the speed of playback |
| Key           | Select the root note |
| Scale         | Select the musical scale (mode) |

-----------

## Development
This project was created using [`create-react-app`](https://github.com/facebook/create-react-app).
It uses:
- [Tone.js](https://github.com/Tonejs/Tone.js) for music/audio generation
- [React Konva](https://github.com/konvajs/react-konva) for canvas manipulation
- [Teoria](https://github.com/saebekassebil/teoria) for music theory logic

### To Run
Clone this repo and run `yarn` and then `yarn start`.

### To Test
Run `yarn test`.
