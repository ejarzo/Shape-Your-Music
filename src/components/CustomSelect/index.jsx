import React from 'react';
import Select from 'react-select';
import Radium from 'radium';
// import Select, { Option } from 'rc-select';
import PropTypes from 'prop-types';

import { ColorUtils } from 'utils/Utils';

import styles from './styles.css';



// class OptionComponent extends React.Component {
//   constructor (props) {
//     super(props);
//     this.handleMouseDown = this.handleMouseDown.bind(this);
//   }
//   handleMouseDown (event) {
//     event.preventDefault();
//     event.stopPropagation();
//     this.props.onSelect(this.props.option, event);
//   }
//   render () {
//     const {
//       color,
//       // children,
//       // className,
//       isDisabled,
//       isFocused,
//       isSelected,
//       // onFocus,
//       onSelect,
//       option,
//     } = this.props;
//     console.log(onSelect);
//     return (
//       <div
//         onMouseDown={this.handleMouseDown}
//         className="Select-option"
//         style={{
//           backgroundColor: ColorUtils.getDarker(color),
//           padding: '3px 8px',
//           color: '#fff',
//           ':hover': {
//             backgroundColor: ColorUtils.getLighter(color),
//           }
//         }}
//       >
//         {this.props.option.label}
//       </div>
//     );
//   }
// }

// OptionComponent.propTypes = {
//   children: PropTypes.node,
//   className: PropTypes.string,
//   isDisabled: PropTypes.bool,
//   isFocused: PropTypes.bool,
//   isSelected: PropTypes.bool,
//   onFocus: PropTypes.func,
//   onSelect: PropTypes.func,
//   option: PropTypes.object.isRequired,  
// };

// const RadiumOption = Radium(OptionComponent);
// function optionComponentWrapper (color) {
//   return props => <RadiumOption color={color} {...props} />;
// }


const propTypes = {
  color: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

function CustomSelect (props) {
  const darkerColor = ColorUtils.getDarker(props.color);

  const arrowRenderer = ({ isOpen }) => (
    <div
      style={{
        color: '#fff',
        fontSize: 15,
      }}
    >
      {isOpen
        ? <i className="ion-chevron-up" />
        : <i className="ion-chevron-down" />
      }
    </div>
  );
  return (
    <Select
      {...props}
      className={styles.customSelect}
      wrapperStyle={{ height: '100%' }}
      menuContainerStyle={{
        marginBottom: 'none',
        background: 'transparent'
      }}
      optionClassName={styles.option}
      // optionComponent={optionComponentWrapper(props.color)}
      // optionRenderer={optionRendererWrapper(darkerColor)}
      valueRenderer={value => (
        <div style={{
          backgroundColor: props.color,
          color: '#fff',
          border: 0,
          height: '100%',
          padding: 3,
        }}>
          {value.label}
        </div>
      )}
      arrowRenderer={arrowRenderer}
      menuStyle={{
        border: `2px solid ${darkerColor}`,
        background: props.color,
        margin: -3,
        boxShadow: '-5 0 12px 0 rgba(0,0,0,0.11)'
      }}
      searchable={false}
      clearable={false}
      value={props.synthParams.name.value}
      options={props.instNamesList}
      onChange={props.onChange}
    />
  );
}

CustomSelect.propTypes = propTypes;

export default CustomSelect;
