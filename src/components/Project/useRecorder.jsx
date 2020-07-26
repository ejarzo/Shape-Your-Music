import { useRef, useState } from 'react';
import moment from 'moment';
import Tone from 'tone';
import Recorder from 'utils/Recorder';

export const useRecorder = () => {
  const recorder = useRef(new Recorder(Tone.Master));
  const [isRecording, setIsRecording] = useState(false);
  const [isArmed, setIsArmed] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState([]);

  const beginRecording = () => {
    setIsArmed(false);
    setIsRecording(true);
    recorder.current.record();
  };

  const stopRecording = (fileName = 'My project') => {
    recorder.current.exportWAV(blob => {
      const url = URL.createObjectURL(blob);
      const newDownloadUrls = downloadUrls.slice();
      const createdAt = moment();
      newDownloadUrls.push({
        url,
        fileName: `${fileName}[shapeyourmusic].wav`,
        createdAt,
      });
      setDownloadUrls(newDownloadUrls);
      recorder.current.stop();
      recorder.current.clear();
    });
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
