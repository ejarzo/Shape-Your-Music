import styles from './Example.css';
import cssModule from 'react-css-modules';
import Tone from 'tone';

const { Component, PropTypes } = React;
const compressor = new Tone.Compressor();

class Example extends Component {
  render() {
    const {
      list,
      title
    } = this.props;

    return (
      <div>
        <h2 styleName="title">{ title }</h2>
        <ul styleName="list">
          { list.map( (li, i) => <li key={ i }>{ li }</li> ) }
        </ul>
      </div>
    );
  }
}

Example.propTypes = {
  list: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

Example.defaultProps = {
  list: [1,2,3],
  title: 'Title'
};

export default cssModule(Example, styles);
