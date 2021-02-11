import React from 'react';
import { Typography } from 'antd';

const { Paragraph, Title } = Typography;

const videoData = [
  {
    id: 510746450,
    title: 'Drawing and Changing Colors',
    description: `Use the draw tool to draw polygons on the canvas. Shapes of the same color use the same instrument, which is chosen using the colored control panels at the bottom. Change a shape's color by clicking on it while using the Edit tool.`,
  },
  {
    id: 510746435,
    title: 'Adjusting Sound',
    description:
      'Use the instrument-specific knobs to control how the different colors sound.',
  },
  {
    id: 510746394,
    title: 'Transposing and Panning Shapes',
    description: (
      <span>
        Moving shapes up and down on the canvas changes the note in the scale at
        which the loop starts. Higher shapes start at higher notes and lower
        shapes start at lower notes.
        <br />
        <br />
        Moving the shapes left and right positions them in stereo space (this is
        more noticeable when using headphones).
      </span>
    ),
  },
  {
    id: 510746381,
    title: 'Duplicate and Reverse',
    description: (
      <span>
        Duplicate a shape by clicking on a shape using the Edit tool to bring up
        the shape context menu and then clicking 'Duplicate'. You can also hold
        down the Option key and click a shape. This creates a clone of the
        shape.
        <br />
        <br />
        Clicking 'Reverse' reverses the shape's playback direction. Since the
        melodies are calculated by using the sequence of edges and angles, this
        will produce a new melody (instead of playing the original notes in
        reverse order).
      </span>
    ),
  },
  {
    id: 510746410,
    title: 'Using the Grid',
    description:
      'With the grid enabled, all new points will snap to the grid. Shapes that had been previously drawn can be manually locked to the grid by dragging their vertexes using the Edit tool.',
  },
  {
    id: 510746342,
    title: 'Using Sync',
    description: (
      <span>
        With Sync enabled, all shapes will be locked to the same perimeter (or a
        multiple thereof). This means that they all loop at the same time (or
        2x, 0.5x times etc.).
        <br />
        <br />
        Click on a shape with the Edit tool to double or halve its length.
      </span>
    ),
  },
  {
    id: 510746360,
    title: 'Record and Download',
    description: (
      <span>
        Click the Record icon to begin recording. The audio of your composition
        will be recorded as a WAV file and can be previewed and downloaded in
        the Downloads section of the sidebar.
      </span>
    ),
  },
];

export default ({ message }) => (
  <div>
    <Title level={1}>Tutorial</Title>
    {videoData.map(({ title, description, id }) => (
      <div style={{ marginBottom: 50, display: 'flex' }}>
        <div style={{ width: 640 }}>
          <iframe
            title={title}
            style={{ boxShadow: '0 0 20px rgba(0,0,0,0.2)' }}
            src={`https://player.vimeo.com/video/${id}?color=ffffff`}
            width="640"
            height="488"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>

        <div style={{ paddingLeft: 25 }}>
          <Title level={2}>{title}</Title>
          <Paragraph>{description}</Paragraph>
        </div>
      </div>
    ))}
  </div>
);
