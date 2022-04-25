import { Project } from '../../projects/project';

function makeProject() {
  return {
    addedToIndex: '',
    authors: [],
    date: '',
    dcpUrl: '',
    enaAccessions: [],
    arrayExpressAccessions: [],
    geoAccessions: [],
    egaAccessions: [],
    dbgapAccessions: [],
    cellXGeneLinks: [],
    sceaLinks: [],
    ucscLinks: [],
    publications: [],
    title: '',
    uuid: '',
    organs: [],
    technologies: [],
    cellCount: 0,
  };
}

export function makeDummyProjects() {
  const dummyProject: Project = makeProject();

  const projects: Project[] = [
    {
      ...dummyProject,
      organs: ['lungs', 'brain'],
      technologies: ['t1', 't2'],
      cellCount: 200,
    },
    {
      ...dummyProject,
      organs: ['kidney', 'lungs'],
      technologies: ['t1', 't3'],
      cellCount: 300,
    },
  ];
  return projects;
}
