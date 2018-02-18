import styles from './TextboxElement.css';

class TextboxElement extends React.Component{

  render() {
    const {
      id,
      className,
      onChange,
      placeholder
    } = this.props;

    return (
      <input id         ={id}
             styleName  ={className}
             onChange   ={onChange}
             placeholder={placeholder} />
    );
  }

};

TextboxElement.defaultProps = {
  className: 'input',
  placeholder: '',
  onChange: () => {},
  id: ''
};

TextboxElement.propTypes = {
  id: React.PropTypes.string,
  className: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func
};


export default cssModule(TextboxElement, styles);
