# Shape Your Music
_A geometric sequencer._

[https://ejarzo.github.io/Shape-Your-Music/](https://ejarzo.github.io/Shape-Your-Music/)

![Project](https://github.com/ejarzo/Shape-Your-Music/blob/master/src/static/img/readme_images/project_screenshot.png)

## About

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Geoboard.JPG/1280px-Geoboard.JPG" alt="drawing" width="100px"/>

Shape Your Music is a musical [geoboard](https://en.wikipedia.org/wiki/Geoboard) that explores a new way of composing and performing music through geometry.

It allows you to create melodic loops by drawing shapes. When a shape plays, a node traverses the perimeter of the shape at a constant speed, sounding a note at each vertex. The interval between the previous note and the next note is determined by the angle at that vertex - A sharp right turn means that the next note is much higher than the previous, while a shallow left turn means that the next note is a little lower. When the last point is reached, the loop starts again.

Draw multiple shapes to generate unique polyrhythms and manipulate shapes in real time to improvise and perform your composition.

[Read more](https://ejarzo.github.io/#sym)

This is SYM's third iteration - a new and improved React implementation of [V2](https://github.com/ejarzo/sym_v2), which was written in vanilla JS/jQuery.

-----------

## User Manual

### Toolbar ![Toolbar](https://github.com/ejarzo/Shape-Your-Music/blob/master/src/static/img/readme_images/toolbar.png)

Item | Name          | Description       |
---- | ------------- | ----------------- |
A    | Play/Stop     | Pressing play starts all shapes at their origin point. A shape plays in the order that it was drawn. |
B    | Record        | Pressing record allows you to download your project as an audio file. If playback is stopped, recording will begin when you begin playback. If he song is playing, the recording will start instantly. Pressing stop or record will end the recording and show a window where you can listen and download what you just recorded |
C    | Color         | Select the color of the shapes you are drawing. Different colored shapes produce different sounds. |
D    | Draw          | Draw mode allows you to create shapes. Click to place vertices. Click on the origin point to complete a shape. Right click to cancel. |
E    | Edit          | Edit mode allows you to adjust your shapes. Drag vertices to edit the perimeter of your shape. drag the whole shape to move it. Click on a shape to show more detailed options (see shape controls). |
F    | Grid          | When selected, the grid is shown |
G    | Snap To Grid  | When selected, all points will snap to the grid when drawn, or when shapes are moved |
H    | Auto Quantize (Sync) | When selected, shapes will snap and lock to the same length - so that they will loop at the same time. Shapes can be “halved’ or “doubled” so that they loop half or twice as often. This allows for a defined rhythm. |
I    | Tempo         | Change the speed of playback |
J    | Key           | Select the root note |
K    | Scale         | Select the musical scale (mode) |
L    | Fullscreen    | Toggle Fullscreen |
M    | Clear         | Delete all shapes |

-----------

## Development
### To Run
Clone this repo and run `yarn` and then `yarn start`.

### To Test
Run `yarn test`.
