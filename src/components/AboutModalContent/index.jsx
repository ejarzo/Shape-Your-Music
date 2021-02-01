import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';

import { ROUTES } from 'Routes';
const { Paragraph, Title, Text } = Typography;

export default ({ message }) => (
  <div>
    <Title level={2}>What is this?</Title>
    <Paragraph>
      Shape Your Music is a musical{' '}
      <a
        className="textLink"
        href="https://en.wikipedia.org/wiki/Geoboard"
        target="blank"
      >
        geoboard
      </a>{' '}
      that explores a new way of composing and performing music using geometry.
      It allows you to create melodic loops by drawing shapes.
    </Paragraph>
    <Paragraph>
      This is a project by{' '}
      <a className="textLink" href="https://ejarzo.github.io/" target="blank">
        Elias Jarzombek
      </a>
      .
    </Paragraph>
    <Paragraph>
      The code is available on{' '}
      <a
        className="textLink"
        href="https://github.com/ejarzo/Shape-Your-Music/"
        target="blank"
      >
        GitHub
      </a>
      .
    </Paragraph>
    <Title level={2}>Features</Title>
    <Paragraph>Using this app, you can:</Paragraph>
    <ul>
      <li>Draw multiple shapes to generate unique polyrhythms</li>
      <li>Manipulate shapes in real time to improvise and perform</li>
      <li>Experiment with different musical modes, keys, and tempos</li>
      <li>Use grid and syncing options to create defined rhythms and loops</li>
      <li>
        Move shapes up or down to transpose them within the scale, or side to
        side to move them in stereo space
      </li>
      <li>Change and adjust the sound that each color produces</li>
      <li>
        Record and export your project as either an audio file or as MIDI files
      </li>
      <li>
        Save projects and{' '}
        <Link className="textLink" to={ROUTES.DISCOVER}>
          browse other people's creations
        </Link>
      </li>
    </ul>

    <Title level={2}>User Manual</Title>
    <Paragraph>
      For more information about how to use the interface, see the{' '}
      <a
        className="textLink"
        href="https://github.com/ejarzo/Shape-Your-Music/#-user-manual"
        target="blank"
      >
        user manual on GitHub
      </a>
    </Paragraph>

    <Title level={2}>Shapes</Title>
    <Paragraph>
      When a shape plays, a node traverses the perimeter of the shape at a
      constant speed, sounding a note at each vertex. The first note of a shape
      is determined by the shape's <Text code>y</Text> position on the plane.
      The note for each subsequent edge is determined by the angle between that
      edge and the previous edge. This angle determines the musical interval
      between the two notes(edges). For example: A sharp right turn means that
      the next note is much higher than the previous, while a shallow left turn
      means that the next note is a little lower. When the last point is
      reached, the loop starts again.
    </Paragraph>
  </div>
);
