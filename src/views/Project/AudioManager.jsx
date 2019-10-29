import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router';
import Tone from 'tone';
import Recorder from 'utils/Recorder';
import { ZipFile } from 'utils/file';
import { SEND_CHANNELS } from 'utils/music';

const MidiWriter = require('midi-writer-js');

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
    this.masterOutput = new Tone.Gain(0.9).receive(SEND_CHANNELS.MASTER_OUTPUT);

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

    // MIDI
    this.convertAndDownloadTracksAsMIDI = this.convertAndDownloadTracksAsMIDI.bind(
      this
    );
  }

  componentWillUnmount() {
    Tone.Transport.stop();
    this.masterCompressor.dispose();
    this.masterLimiter.dispose();
    this.masterOutput.dispose();
  }

  toggleTransport() {
    Tone.Transport.toggle();
  }

  beginRecording() {
    this.recorder.record();
    this.setState({ isRecording: true });
  }

  stopRecording(fileName = 'My Project') {
    this.recorder.exportWAV(blob => {
      const url = URL.createObjectURL(blob);
      const downloadUrls = this.state.downloadUrls.slice();
      const createdAt = moment();

      downloadUrls.push({
        url,
        fileName: `${fileName}[shapeyourmusic].wav`,
        createdAt,
      });
      this.setState({ downloadUrls });
      this.recorder.stop();
      this.recorder.clear();
    });
    this.setState({
      isRecording: false,
      isArmed: false,
    });
  }

  /* Exports (downloads) all shapes as individual MIDI files */
  async convertAndDownloadTracksAsMIDI({ tempo, shapeNoteEventsList }) {
    const zip = ZipFile('Shape Your Music Project');

    // create MIDI track for each shape
    shapeNoteEventsList.forEach((noteEvents, i) => {
      const track = new MidiWriter.Track();

      // TODO: confirm what the MIDI tempo should be
      track.setTempo(60);
      track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
      track.addTrackName(`Shape ${i + 1}`);

      // TODO: confirm Tick duration calculation
      noteEvents.forEach(({ note, duration }) => {
        const midiNoteEvent = {
          pitch: [note],
          duration: `T${duration * 60 * (100 / tempo)}`,
        };
        const midiNote = new MidiWriter.NoteEvent(midiNoteEvent);
        track.addEvent(midiNote);
      });

      const write = new MidiWriter.Writer([track]);
      zip.add(`shape-${i + 1}.mid`, write.buildFile());
    });

    await zip.download();
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
          convertAndDownloadTracksAsMIDI: this.convertAndDownloadTracksAsMIDI,
        })}
      </div>
    );
  }
}

export default withRouter(AudioManager);
