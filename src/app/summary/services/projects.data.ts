import { HCABionetwork, Project } from '../../projects/project';
import { ProjectsService } from '../../projects/services/projects.service';

function makeProject(): Project {
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
    hca_bionetworks: [],
  };
}

export function makeDummyProjects() {
  const dummyProject: Project = makeProject();
  const dummyNetwork: HCABionetwork = {
    name: '',
    hca_tissue_atlas: '',
    hca_tissue_atlas_version: '',
    atlas_project: false,
  };
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
      hca_bionetworks: [{ ...dummyNetwork, name: 'Lung' }],
      cellCount: 300,
    },
  ];
  return projects;
}
