# Shape Your Music

A web application for drawing music.

This is V3, a new and improved React implementation of [V2](https://github.com/ejarzo/sym_v2), which was written in vanilla JS/jQuery.


## Application Controls

### Playback
| Button    | Description       |
| --------- | ----------------- |
| Play/Stop | Pressing play starts all shapes at their origin point. A shape plays in the order that it was drawn. |
| Record    | Pressing record allows you to download your project as an audio file. If playback is stopped, recording will begin when you begin playback. If he song is playing, the recording will start instantly. Pressing stop or record will end the recording and show a window where you can listen and download what you just recorded |

### Tools
| Tool      | Description       |
| --------- | ----------------- |
| Draw      | Draw mode allows you to create shapes. click to place vertices. Click on the origin point to complete a shape. Select your draw color by using the colored box within the draw tool button. |
| Edit      | Edit mode allows you to adjust your shapes. Drag vertices to edit the perimeter of your shape. drag the whole shape to move it. Click on a shape to show more detailed options (see shape controls). |

### Canvas Modifiers
| Toggle        | Description       |
| ------------- | ----------------- |
| Grid          | When selected, the grid is shown |
| Snap To Grid  | When selected, all points will snap to the grid when drawn, or when shapes are moved |
| Auto Quantize (Sync) | When selected, shapes will snap and lock to the same length - so that they will loop at the same time. Shapes can be “halved’ or “doubled” so that they loop half or twice as often. This allows for a defined rhythm. |

### Musical Modifiers
| Control       | Description       |
| ------------- | ----------------- |
| Tempo         | Change the speed of playback |
| Key           | Select the root note |
| Scale         | Select the musical scale (mode) |

### View Modifiers
| Control       | Description       |
| ------------- | ----------------- |
| Fullscreen    | Toggle Fullscreen |
| Clear         | Delete all shapes |

## Development

### To Run
Clone this repo and run `npm install` and then `npm start`.

### Testing
Testing is handled by Karma. Run `npm test` or `npm test_watch`.
