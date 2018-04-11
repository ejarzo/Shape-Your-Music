import React from 'react';
import Select from 'react-select';
import Color from 'color';
import PropTypes from 'prop-types';
import Knob from 'components/Knob';

const propTypes = {
  colorIndex: PropTypes.number.isRequired,
  colorsList: PropTypes.array.isRequired,
  instNamesList: PropTypes.array.isRequired,
  
  synthParams: PropTypes.shape({
    name: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
    baseSynth: PropTypes.func.isRequired,
    dynamicParams: PropTypes.array.isRequired,
    effects: PropTypes.array,
  }).isRequired,
  knobVals: PropTypes.array.isRequired,
  
  onKnobChange: PropTypes.func.isRequired,
  handleInstChange: PropTypes.func.isRequired,
};

function InstColorControllerComponent (props) {
  const color = props.colorsList[props.colorIndex];
  const titleBackgroundColor = color;
  const contentBackgroundColor = Color(color).lighten(0.1);

  return (
    <div>
      {/*<div className="inst-title" style={{backgroundColor: titleBackgroundColor}}>
        <div style={{width: '50%', backgroundColor: Color(color).darken(0.1)}}>
          <Select
            optionRenderer={option => (
              <div style={{backgroundColor: titleBackgroundColor}}>
                {option.label}
              </div>
            )}
            menuStyle={{
              background: titleBackgroundColor
            }}
            className="inst-select"
            searchable={true}
            clearable={false}
            name="Instrument Select"
            value={props.synthParams.name.value}
            options={props.instNamesList}
            onChange={this.handleInstChange}
          />
        </div>
      </div>
      <ul
        className="inst-params"
        style={{
          backgroundColor: contentBackgroundColor
        }}
      >
        {props.synthParams.dynamicParams.map((effect, i) => (
          <li key={i}>
            <Knob
              paramName={effect.name}
              value={props.knobVals[i]}
              onChange={this.handleParamValueChange(i)}
            />
          </li>
        ))}
      </ul>*/}
    </div>
  );
}

InstColorControllerComponent.propTypes = propTypes;

export default InstColorControllerComponent;


// render () {
//   const color = this.props.colorsList[this.props.colorIndex];
//   const titleBackgroundColor = color;
//   const contentBackgroundColor = Color(color).lighten(0.1);
  
//   return (    
//     <li className="inst-option">
//       <div className="inst-title" style={{backgroundColor: titleBackgroundColor}}>
//         <div style={{width: '50%', backgroundColor: Color(color).darken(0.1)}}>
//           <Select
//             optionRenderer={option => (
//               <div style={{backgroundColor: titleBackgroundColor}}>
//                 {option.label}
//               </div>
//             )}
//             menuStyle={{
//               background: titleBackgroundColor
//             }}
//             className="inst-select"
//             searchable={true}
//             clearable={false}
//             name="Instrument Select"
//             value={this.props.synthParams.name.value}
//             options={this.props.instNamesList}
//             onChange={this.handleInstChange}
//           />
//           {/*<button className="show-hide show-hide-inst" data-target="inst-selectors" title="Show/Hide synth controls">
//             <i className="ion-arrow-left-b"></i>
//           </button>*/}
//         </div>
//       </div>
//       <ul
//         className="inst-params"
//         style={{
//           backgroundColor: contentBackgroundColor
//         }}
//       >
//         {this.props.synthParams.dynamicParams.map((effect, i) => (
//           <li key={i}>
//             <Knob
//               paramName={effect.name}
//               value={this.props.knobVals[i]}
//               onChange={this.handleParamValueChange(i)}
//             />
//           </li>
//         ))}
//       </ul>
//     </li>
//   );
// }