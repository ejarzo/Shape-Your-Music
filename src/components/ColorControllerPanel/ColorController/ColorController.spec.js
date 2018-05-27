import { expect } from 'chai';
import ColorController from './index.jsx';

/*
  const propTypes = {
  instrumentPresets: PropTypes.array.isRequired,
  selectedInstruments: PropTypes.array.isRequired,
  colorsList: PropTypes.array.isRequired,
  instNamesList: PropTypes.array.isRequired,
  knobVals: PropTypes.array.isRequired,
  onInstChange: PropTypes.func.isRequired,
  onKnobChange: PropTypes.func.isRequired,
};

*/
const props = {
  instrumentPresets: [],
  selectedInstruments: [],
  colorsList: [],
  instNamesList: [],
  knobVals: [],
  onInstChange: [],
  onKnobChange: [],
};

describe('Color Controller', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
