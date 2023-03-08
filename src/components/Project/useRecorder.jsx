import { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import * as Tone from 'tone';
import { SEND_CHANNELS } from 'utils/music';

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
    const recording = await recorder.current.stop();
    const url = URL.createObjectURL(recording);
    const newDownloadUrls = downloadUrls.slice();
    const createdAt = moment();
    newDownloadUrls.push({
      url,
      fileName: `${fileName}[shapeyourmusic].webm`,
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
