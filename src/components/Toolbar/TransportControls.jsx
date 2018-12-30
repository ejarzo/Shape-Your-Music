import React from 'react';
import { bool, func } from 'prop-types';

import IconButton from 'components/IconButton';
import { appColors } from 'utils/color';

import styles from './styles.module.css';

const { red } = appColors;

function TransportControls(props) {
  const playButtonClass = props.isPlaying ? 'ion-stop' : 'ion-play';
  return (
    <div className={styles.toolbarSection}>
      <div>
        <IconButton
          iconClassName={playButtonClass}
          onClick={props.handlePlayClick}
          title="Play project (SPACE)"
        />
      </div>
      <div
        className={props.isRecording ? styles.pulse : undefined}
        style={{ color: (props.isArmed || props.isRecording) && red }}
      >
        <IconButton
          iconClassName={'ion-record'}
          onClick={props.handleRecordClick}
          title="Record project to audio file"
        />
      </div>
    </div>
  );
}

TransportControls.propTypes = {
  isPlaying: bool.isRequired,
  isArmed: bool.isRequired,
  isRecording: bool.isRequired,
  handlePlayClick: func.isRequired,
  handleRecordClick: func.isRequired,
};

export default TransportControls;
