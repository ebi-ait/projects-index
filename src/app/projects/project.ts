export interface Link {
  name: string;
  href: string;
}

export interface Publication {
  doi: string;
  url: string;
  journalTitle: string;
  title: string;
  authors: string[];
}

export interface HCABionetwork {
  name: string;
  hca_tissue_atlas: string;
  hca_tissue_atlas_version: string;
  atlas_project: boolean;
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
  arrayExpressAccessions: Link[];
  geoAccessions: Link[];
  egaAccessions: Link[];
  dbgapAccessions: Link[];
  cellXGeneLinks: Link[];
  sceaLinks: Link[];
  ucscLinks: Link[];
  publications: Publication[];
  authors: string[];
  hca_bionetworks: HCABionetwork[];
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
  availableHcaBionetworks: string[];
}
