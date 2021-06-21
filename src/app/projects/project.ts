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
