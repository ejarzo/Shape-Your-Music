import JSZip from 'jszip';
import { saveAs } from 'file-saver';
const MidiWriter = require('midi-writer-js');

export const ZipFile = name => {
  const zip = new JSZip();
  const folder = zip.folder(name);

  return {
    add: (name, data) => {
      folder.file(`${name}`, data);
    },
    download: async () => {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${name}.zip`);
    },
  };
};

export const convertAndDownloadTracksAsMIDI = async ({
  tempo,
  shapeNoteEventsList,
}) => {
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
};
