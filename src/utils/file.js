export const downloadFile = (filename, dataFile) => {
  const element = document.createElement('a');
  element.setAttribute('href', dataFile);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
