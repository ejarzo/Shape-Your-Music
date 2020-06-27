import { useState, useEffect } from 'react';
import Tone from 'tone';
import { SEND_CHANNELS } from 'utils/music';

export const useAudioOutput = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    /* master output */
    const masterCompressor = new Tone.Compressor({
      ratio: 16,
      threshold: -30,
      release: 0.25,
      attack: 0.003,
      knee: 30,
    });

    const masterLimiter = new Tone.Limiter(-2);
    const masterOutput = new Tone.Gain(0.9).receive(
      SEND_CHANNELS.MASTER_OUTPUT
    );
    masterOutput.chain(masterCompressor, masterLimiter, Tone.Master);
    return () => {
      Tone.Transport.stop();
      masterCompressor.dispose();
      masterLimiter.dispose();
      masterOutput.dispose();
    };
  }, []);

  const toggleIsPlaying = () => {
    Tone.Transport.toggle();
    setIsPlaying(!isPlaying);
  };

  return {
    isPlaying,
    toggleIsPlaying,
  };
};
