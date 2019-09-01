import { readResult } from './utils';

export const readProject = async projectId =>
  await readResult(`project-read/${projectId}`);
