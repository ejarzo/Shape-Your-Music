import React from 'react';
import { withRouter } from 'react-router';
import Tone from 'tone';

class AudioManager extends React.Component {
  constructor(props) {
    super(props);

    /* master output */
    this.masterCompressor = new Tone.Compressor({
      ratio: 16,
      threshold: -30,
      release: 0.25,
      attack: 0.003,
      knee: 30,
    });

    this.masterLimiter = new Tone.Limiter(-2);
    this.masterOutput = new Tone.Gain(0.9).receive('masterOutput');

    this.masterOutput.chain(
      this.masterCompressor,
      this.masterLimiter,
      Tone.Master
    );
  }

  componentWillUnmount() {
    Tone.Transport.stop();
    this.masterCompressor.dispose();
    this.masterLimiter.dispose();
    this.masterOutput.dispose();
  }

  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

export default withRouter(AudioManager);
