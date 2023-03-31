import { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import * as Tone from 'tone';
import { SEND_CHANNELS } from 'utils/music';
import audiobufferToWav from 'audiobuffer-to-wav';

async function convertWebMToWAV(webmBlob) {
  // Read the WebM data as an ArrayBuffer
  const arrayBuffer = await webmBlob.arrayBuffer();

  // Decode the WebM data using the Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Encode the AudioBuffer as WAV using the 'audiobuffer-to-wav' library
  const wavBlob = new Blob([audiobufferToWav(audioBuffer)], {
    type: 'audio/wav',
  });

  return wavBlob;
}

export const useRecorder = () => {
  const recorder = useRef(null);
  useEffect(() => {
    const recorderChannel = new Tone.Channel();
    recorderChannel.receive(SEND_CHANNELS.RECORDER);
    recorder.current = new Tone.Recorder();
    recorderChannel.connect(recorder.current);
  }, []);

  const [isRecording, setIsRecording] = useState(false);
  const [isArmed, setIsArmed] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState([]);

  const beginRecording = () => {
    setIsArmed(false);
    setIsRecording(true);
    recorder.current.start();
  };

  const stopRecording = async (fileName = 'My project') => {
    const webmBlob = await recorder.current.stop();
    const wavBlob = await convertWebMToWAV(webmBlob);
    const url = URL.createObjectURL(wavBlob);
    const newDownloadUrls = downloadUrls.slice();
    const createdAt = moment();
    newDownloadUrls.push({
      url,
      fileName: `${fileName}[shapeyourmusic].wav`,
      createdAt,
    });
    setDownloadUrls(newDownloadUrls);
    setIsRecording(false);
  };

  return {
    isArmed,
    isRecording,
    beginRecording,
    stopRecording,
    downloadUrls,
    armRecording: () => {
      setIsArmed(!isArmed);
    },
  };
};
