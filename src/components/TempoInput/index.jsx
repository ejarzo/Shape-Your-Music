import React from 'react';
import PropTypes from 'prop-types';
import CustomSlider from 'components/Slider';
import { appColors, getDarker } from 'utils/color';
const { grayLightest } = appColors;
const lightGray = getDarker(grayLightest);

const propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

function TempoInput(props) {
  const { value, onChange } = props;
  return (
    <div
      style={{
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${lightGray}`,
      }}
    >
      <CustomSlider
        min={5}
        max={100}
        color="#eee"
        vertical={false}
        defaultValue={value}
        onChange={onChange}
        label={<span style={{ color: 'initial' }}>Tempo</span>}
      />
    </div>
  );
}

TempoInput.propTypes = propTypes;

export default TempoInput;
