import {Project} from "../../projects/project";

function makeProject() {
  return {
    addedToIndex: "",
    arrayExpressAccessions: [],
    authors: [],
    date: "",
    dcpUrl: "",
    egaDatasetsAccessions: [],
    egaStudiesAccessions: [],
    enaAccessions: [],
    geoAccessions: [],
    publications: [],
    title: "",
    uuid: "",
    organs: [],
    technologies: [],
    cellCount: 0
  };
}

export function makeDummyProjects() {
  let dummyProject: Project = makeProject();

  let projects: Project[] = [
    {...dummyProject, organs: ['lungs', 'brain'], technologies: ['t1', 't2'], cellCount: 200},
    {...dummyProject, organs: ['kidney', 'lungs'], technologies: ['t1', 't3'], cellCount: 300}
  ];
  return projects;
}
