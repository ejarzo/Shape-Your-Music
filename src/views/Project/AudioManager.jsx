import React from 'react';
import { withRouter } from 'react-router';
import Tone from 'tone';
import Recorder from 'utils/Recorder';

class AudioManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadUrls: [],
    };

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

    this.toggleTransport = this.toggleTransport.bind(this);

    // recorder
    this.recorder = new Recorder(Tone.Master);
    this.beginRecording = this.beginRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
  }

  componentWillUnmount() {
    Tone.Transport.stop();
    this.masterCompressor.dispose();
    this.masterLimiter.dispose();
    this.masterOutput.dispose();
  }

  beginRecording() {
    this.recorder.record();
    this.setState({ isRecording: true });
  }

  stopRecording() {
    this.recorder.exportWAV(blob => {
      const url = URL.createObjectURL(blob);
      const downloadUrls = this.state.downloadUrls.slice();
      downloadUrls.push(url);
      this.setState({ downloadUrls });
      this.recorder.stop();
      this.recorder.clear();
    });
    this.setState({
      isRecording: false,
      isArmed: false,
    });
  }

  toggleTransport() {
    Tone.Transport.toggle();
  }

  render() {
    const { downloadUrls } = this.state;
    const { children } = this.props;
    return (
      <div>
        {children({
          downloadUrls,
          beginRecording: this.beginRecording,
          stopRecording: this.stopRecording,
          toggleTransport: this.toggleTransport,
        })}
      </div>
    );
  }
}

export default withRouter(AudioManager);
