import { useContext } from 'react';
import { ProjectContext } from 'components/Project/ProjectContextProvider';

export const useProjectContext = () => {
  const projectContext = useContext(ProjectContext);
  return projectContext;
};
