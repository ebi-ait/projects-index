import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Project } from './project';

// todo: fix up this service

@Injectable()
export class ProjectsService {
  constructor(private http: HttpClient) {}
  URL = `${environment.ingestApiUrl}${environment.catalogueEndpoint}`;

  getProjects(): Observable<Project[]> {
    return this.http.get<any>(this.URL).pipe(
      map((response) => {
        if (response) {
          return response._embedded.projects.map(this.formatProject);
        }
      })
    );
  }

  formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString('en-gb', {
      timeZone: 'utc',
    });

  captureRegexGroups = (regex: RegExp, strings: string[]) =>
    strings
      .map((str) => regex.exec(str))
      .filter((match) => match && match.length) ?? [].map((match) => match[1]);

  formatProject = (obj: any): Project => {
    try {
      return {
        uuid: obj.uuid.uuid,
        dcpUrl: obj.dcp_url,
        addedToIndex: obj.added_to_index,
        date: obj.added_to_index ? this.formatDate(obj.added_to_index) : '-',
        title: obj.content.project_core.project_title,
        organs:
          obj.organ?.ontologies?.map((organ) => organ.ontology_label) ?? [],
        technologies:
          obj.technology?.ontologies?.map((tech) => tech.ontology_label) ?? [],
        // Temp fix until ena accessions fixed in core
        enaAccessions: (() => {
          const accessions = obj.content?.insdc_project_accessions;
          if (typeof accessions === 'string') {
            return [accessions];
          }
          return accessions ?? [];
        })(),
        geoAccessions: obj.content.geo_series_accessions ?? [],
        arrayExpressAccessions: obj.content.array_expobjs_accessions ?? [],
        egaStudiesAccessions: this.captureRegexGroups(
          /.*\/studies\/(EGAS\d*).*/i,
          obj.content.supplementary_links || []
        ),
        egaDatasetsAccessions: this.captureRegexGroups(
          /.*\/studies\/(EGAD\d*).*/i,
          obj.content.supplementary_links || []
        ),
        publications: obj.content.publications ?? [],
        authors: obj.content.contributors.map((author) => {
          const names = author.name.split(',');
          const formattedName = `${
            names[names.length - 1]
          } ${names[0][0].toUpperCase()}`;
          return {
            fullName: author.name,
            formattedName,
          };
        }),
      };
    } catch (e) {
      console.error(`Error in project ${obj.uuid.uuid}: ${e.message}`);
    }
  };
}
