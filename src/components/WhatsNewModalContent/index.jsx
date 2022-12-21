import React from 'react';
import { Typography } from 'antd';
const { Paragraph, Title, Text } = Typography;

export default ({ message }) => (
  <div>
    <Title level={2}>What's New</Title>
    <Text type="secondary">DECEMBER 2022</Text>
    <Title level={4}>Proximity Mode</Title>
    <Paragraph>
      <ul>
        <li>
          Turn on Proximity Mode to experience your project spatially, where the
          listening position is controlled with the mouse.
        </li>
        <li>
          Moving the mouse around the canvas allows you to create a progression
          by focusing on different shapes.
        </li>
        {/* <li>
          <strong>NOTE</strong>: A shapes 'position' is at the center of its
          points. 
        </li> */}
        <li>
          Hover over the <i className="ion-chevron-down" /> icon to adjust the
          listening radius
        </li>
        <li>
          With Proximity Mode <strong>off</strong>, the shapes are panned
          according to their horizontal position.
        </li>
      </ul>
    </Paragraph>
    <Title level={4}>Add and Delete Shape Points</Title>
    <Paragraph>
      <ul>
        <li>
          <strong>Click on a midpoint</strong> to create a new point.
        </li>
        <li>
          <strong>Double Click</strong> to delete a point.
        </li>
      </ul>
    </Paragraph>
  </div>
);
