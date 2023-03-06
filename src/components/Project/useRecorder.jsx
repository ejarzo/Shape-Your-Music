import { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import * as Tone from 'tone';
import Recorder from 'utils/Recorder';
import { SEND_CHANNELS } from 'utils/music';
// const recorder = new Tone.Recorder();

export const useRecorder = () => {
  const recorder = useRef(null);
  useEffect(() => {
    const recorderChannel = new Tone.Channel();
    recorderChannel.receive(SEND_CHANNELS.RECORD);
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
    console.log(recording);
    // recorder.current.exportWAV(blob => {
    const url = URL.createObjectURL(recording);
    const newDownloadUrls = downloadUrls.slice();
    const createdAt = moment();
    newDownloadUrls.push({
      url,
      fileName: `${fileName}[shapeyourmusic].ogg`,
      createdAt,
    });
    setDownloadUrls(newDownloadUrls);
    // recorder.current.stop();
    // recorder.current.clear();
    // });
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
