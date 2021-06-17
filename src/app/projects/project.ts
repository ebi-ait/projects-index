interface Publication {
  doi: string;
  url: string;
  journalTitle: string;
  title: string;
  authors: string[];
}

export interface Author {
  fullName: string;
  formattedName: string;
}

export interface Project {
  uuid: string;
  dcpUrl: string;
  addedToIndex: string;
  date: string;
  title: string;
  organs: string[];
  technologies: string[];
  cellCount: number;
  enaAccessions: string[];
  geoAccessions: string[];
  arrayExpressAccessions: string[];
  egaStudiesAccessions: string[];
  egaDatasetsAccessions: string[];
  publications: Publication[];
  authors: Author[];
}
export interface PaginatedList<T> {
  items: T[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface PaginatedProjects extends PaginatedList<Project> {
  availableTechnologies: string[];
  availableOrgans: string[];
  // The total number of projects available
  // This is different to PaginatedList.totalItems as totalItems could be the
  // length of the filtered list. While availableProjects is the length of the
  // list without any filters applied.
  availableProjects: number;
}
