export interface Link {
  name: string;
  href: string;
}

interface Publication {
  doi: string;
  url: string;
  journalTitle: string;
  title: string;
  authors: string[];
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
  enaAccessions: Link[];
  geoAccessions: string[];
  arrayExpressAccessions: string[];
  egaStudiesAccessions: string[];
  egaDatasetsAccessions: string[];
  dbgapAccessions: string[];
  cellXGeneLinks: Link[];
  sceaLinks: Link[];
  ucscLinks: Link[];
  publications: Publication[];
  authors: string[];
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
}
