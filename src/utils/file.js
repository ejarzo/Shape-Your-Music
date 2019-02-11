import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
