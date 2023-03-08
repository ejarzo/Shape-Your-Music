import { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { SEND_CHANNELS } from 'utils/music';

export const useAudioOutput = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    /* master output */
    const destinationCompressor = new Tone.Compressor({
      ratio: 16,
      threshold: -30,
      release: 0.25,
      attack: 0.003,
      knee: 30,
    });

    const destinationLimiter = new Tone.Limiter(-2);

    /* TODO set gain */
    const destinationOutput = new Tone.Channel(-2, 0).receive(
      SEND_CHANNELS.MASTER_OUTPUT
    );

    const recordOut = new Tone.Channel(0, 0).send(SEND_CHANNELS.RECORDER, 0);
    const finalNode = new Tone.Gain();

    finalNode.fan(recordOut, Tone.Destination);

    destinationOutput.chain(
      destinationCompressor,
      destinationLimiter,
      finalNode
    );
    return () => {
      Tone.Transport.stop();
      destinationCompressor.dispose();
      destinationLimiter.dispose();
      destinationOutput.dispose();
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
