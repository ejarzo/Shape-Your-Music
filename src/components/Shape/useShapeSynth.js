import Tone from 'tone';
import { SYNTH_PRESETS } from 'instrumentPresets';
import { SEND_CHANNELS } from 'utils/music';

export const useShapeAttrs = ({ selectedSynths, colorIndex, knobVals }) => {
  const setSynth = () => {
    const selectedSynth = selectedSynths[colorIndex];
    const shapeKnobVals = knobVals[colorIndex];
    const synthObj = SYNTH_PRESETS[selectedSynth];

    if (this.synth) {
      this.synth.triggerRelease();

      this.panner.disconnect();
      this.panner.dispose();
      this.solo.disconnect();
      this.solo.dispose();
      this.gain.disconnect();
      this.gain.dispose();

      this.synth.volume.exponentialRampToValueAtTime(
        -Infinity,
        Tone.now() + 0.2
      );

      this.synth.disconnect();
      this.synth.dispose();
    }

    this.synth = new synthObj.baseSynth(synthObj.params, () => {
      console.log('LOADED');
      this.setState({ isBuffering: false });
    });
    if (this.synth instanceof Tone.Sampler) {
      console.log('setting isbuffering to true');
      this.setState({ isBuffering: true });
    }
    this.synth.volume.exponentialRampToValueAtTime(
      this.props.volume,
      Tone.now() + 0.2
    );

    shapeKnobVals.forEach((val, i) => {
      if (synthObj.dynamicParams[i].target === 'instrument') {
        synthObj.dynamicParams[i].func(this, val);
      }
    });

    this.panner = new Tone.Panner(0);
    this.solo = new Tone.Solo();
    this.gain = new Tone.Gain().send(
      `${SEND_CHANNELS.FX_PREFIX}${colorIndex}`,
      0
    );

    this.synth.chain(this.panner, this.solo, this.gain);
  };

  return { isBuffering: false };
};
