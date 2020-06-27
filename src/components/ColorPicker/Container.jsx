import React from 'react';
import { func, number, string } from 'prop-types';
import { GithubPicker } from 'react-color';
import { themeColors } from 'utils/color';
import withProjectContext from 'components/Project/withProjectContext';

const propTypes = {
  onChange: func.isRequired,
  activeColorIndex: number.isRequired,
  color: string.isRequired,
  triangle: string,
};

function ColorPicker(props) {
  return (
    <div>
      <GithubPicker
        style={{ borderRadius: 0 }}
        onChange={props.onChange}
        color={props.color}
        colors={themeColors}
        width="100%"
        triangle={props.triangle}
      />
    </div>
  );
}

ColorPicker.propTypes = propTypes;

export default withProjectContext(ColorPicker);
