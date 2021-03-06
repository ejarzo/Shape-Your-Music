import React from 'react';
import { Typography } from 'antd';

const { Paragraph, Title, Text } = Typography;

const videoData = [
  {
    id: 511362280,
    title: 'How Shapes Make Melodies',
    description: (
      <span>
        When a shape plays, a node traverses the perimeter of the shape at a
        constant speed, sounding a note at each vertex.
        <br />
        <br />
        The first note of a shape is determined by the shape's{' '}
        <Text code>y</Text> position on the plane. The note for each subsequent
        edge is determined by the angle between that edge and the previous edge.
        This angle determines the musical interval between the two notes(edges).
        For example: A sharp right turn means that the next note is much lower
        than the previous, while a shallow left turn means that the next note is
        a little higher. When the last point is reached, the loop starts again.
      </span>
    ),
  },
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
    title: 'Duplicating and Reversing Shapes',
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
    title: 'Recording and Downloading a Project',
    description: (
      <span>
        Click the Record icon to begin recording. The audio of your composition
        will be recorded as a WAV file and can be previewed and downloaded in
        the Downloads section of the sidebar.
      </span>
    ),
  },
  {
    id: 511273130,
    title: 'Saving and Loading a Project',
    description: (
      <span>
        Click the Save icon to name and save your project. You can view your
        projects in the account dropdown in the top right corner.
        <br />
        <br />
        If you are not logged in you will be prompted to log in or sign up.
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
            src={`https://player.vimeo.com/video/${id}?color=ffffff&title=0&byline=0&portrait=0`}
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
