import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Project } from './project';

//todo: fix up this service

@Injectable()
export class ProjectsService {
  URL = `${environment.ingestApiUrl}${environment.catalogueEndpoint}`;

  constructor(private http: HttpClient) {}

  //original URL is STATIC_DATA_URL=/humancellatlas/project-catalogue/data.json
  getProjects(): Observable<Project[]> {
    return this.http.get<Array<object>>(this.URL).pipe(
      map((response) => {
        if (response) {
          return this.formatProject(response['_embedded']['projects']);
        }
      })
    );
  }

  // todo: sort this accoding to the added_to_index field here
  // sort here or in component?
  formatProject(response: object[]): Project[] {
    return response.map((res) => ({
      uuid: res['uuid']['uuid'], // why do we need this?
      dcpUrl: res['dcp_url'], // why do we need this?
      addedToIndex: res['added_to_index'],
      date: new Date(res['added_to_index'] * 1000).toLocaleDateString('en-gb', {
        timeZone: 'utc',
      }),
      title: res['content']?.['project_core']?.['project_title'],
      organs:
        res['organ']?.['ontologies']?.map(function (organ) {
          return organ['ontology_label'];
        }) ?? [],
      // organs: res["organ"]?.["ontologies"]?.map(organ => ({organ_label: organ["ontology_label"]})) ?? [],
      technologies:
        res['technology']?.['ontologies']?.map(function (technology) {
          return technology['ontology_label'];
        }) ?? [],
      // technologies: res["technology"]?.["ontologies"]?.map(technology => ({technology_label: technology["ontology_label"]})) ?? [],
      enaAccessions: (() => {
        const accessions = res['content']?.['insdc_project_accessions'];
        if (typeof accessions === 'string') {
          return [accessions];
        }
        return accessions ?? [];
      })(),
      geoAccessions: res['content']?.['geo_series_accessions'] ?? [],
      arrayExpressAccessions:
        res['content']?.['array_express_accessions'] ?? [],
      // egaStudiesAccessions: res["content"]?.["supplementary_links"] ?? [],
      egaStudiesAccessions:
        res['content']?.['supplementary_links']
          ?.map((link) => /.*\/studies\/(EGAS\d*).*/i.exec(link))
          .filter((match) => match && match.length) ??
        [].map((match) => match[1]),
      egaDatasetsAccessions:
        res['content']?.['supplementary_links']
          ?.map((link) => /.*\/studies\/(EGAD\d*).*/i.exec(link))
          .filter((match) => match && match.length) ??
        [].map((match) => match[1]),
      publications: res['content']?.['publications'] ?? [],

      // const formatted_name = `${
      //   names[names.length - 1]
      // } ${names[0][0].toUpperCase()}`;

      authors:
        res['content']?.['contributors']?.map(function (contributor) {
          const names = contributor['name'].split(',');
          return `${names[names.length - 1]} ${names[0][0].toUpperCase()}`;
        }) ?? [],
    }));
  }
}
