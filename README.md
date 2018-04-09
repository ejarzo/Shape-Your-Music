# Shape Your Music
_A web application for drawing music._

Shape Your Music is a program that explores a new way of composing and performing music through geometry.

The idea is to create melodic loops by drawing shapes. When a shape plays, a node traverses the perimeter of the shape at a constant speed, sounding a note at each vertex. The interval between the previous note and the next note is determined by the angle at that vertex - A sharp right turn means that the next note is much higher than the previous, while a shallow left turn means that the next note is a little lower. When the last point is reached, the loop starts again.

This is SYM's third iteration - a new and improved React implementation of [V2](https://github.com/ejarzo/sym_v2), which was written in vanilla JS/jQuery.

-----------

## User Manual

### Playback
![playback controls](https://github.com/ejarzo/Shape-Your-Music/blob/master/src/static/img/readme_images/transport.png)

| Button    | Description       |
| --------- | ----------------- |
| Play/Stop | Pressing play starts all shapes at their origin point. A shape plays in the order that it was drawn. |
| Record    | Pressing record allows you to download your project as an audio file. If playback is stopped, recording will begin when you begin playback. If he song is playing, the recording will start instantly. Pressing stop or record will end the recording and show a window where you can listen and download what you just recorded |

### Tools
![tools](https://github.com/ejarzo/Shape-Your-Music/blob/master/src/static/img/readme_images/tools.png)

| Tool      | Description       |
| --------- | ----------------- |
| Color     | Select the color of the shapes you are drawing. Different colored shapes produce different sounds. |
| Draw      | Draw mode allows you to create shapes. Click to place vertices. Click on the origin point to complete a shape. Right click to cancel. |
| Edit      | Edit mode allows you to adjust your shapes. Drag vertices to edit the perimeter of your shape. drag the whole shape to move it. Click on a shape to show more detailed options (see shape controls). |

### Canvas Modifiers
![canvas modifiers](https://github.com/ejarzo/Shape-Your-Music/blob/master/src/static/img/readme_images/canvas.png)

| Toggle        | Description       |
| ------------- | ----------------- |
| Grid          | When selected, the grid is shown |
| Snap To Grid  | When selected, all points will snap to the grid when drawn, or when shapes are moved |
| Auto Quantize (Sync) | When selected, shapes will snap and lock to the same length - so that they will loop at the same time. Shapes can be “halved’ or “doubled” so that they loop half or twice as often. This allows for a defined rhythm. |

### Musical Modifiers
![musical modifiers](https://github.com/ejarzo/Shape-Your-Music/blob/master/src/static/img/readme_images/musical.png)

| Control       | Description       |
| ------------- | ----------------- |
| Tempo         | Change the speed of playback |
| Key           | Select the root note |
| Scale         | Select the musical scale (mode) |

### View Modifiers
![musical modifiers](https://github.com/ejarzo/Shape-Your-Music/blob/master/src/static/img/readme_images/other.png)

| Control       | Description       |
| ------------- | ----------------- |
| Fullscreen    | Toggle Fullscreen |
| Clear         | Delete all shapes |

-----------

## Development
### To Run
Clone this repo and run `npm install` and then `npm start`.

### To Test
Testing is handled by Karma. Run `npm test` or `npm test_watch`.
