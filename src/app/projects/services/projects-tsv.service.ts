import { Project } from '../project';

export class ProjectsTsvService {
  static asTsvString(projects: Project[], columns: object) {
    return this.projectsAsTsvArray(projects, columns).join('\r\n');
  }

  private static projectsAsTsvArray(projects: Project[], columns: object) {
    const tsvArray = projects.map((project: Project) =>
      this.projectAsTsvString(project, Object.keys(columns))
    );
    tsvArray.unshift(Object.values(columns).join('\t'));
    return tsvArray;
  }

  private static projectAsTsvString(project: Project, keys) {
    return keys
      .map((key) => ProjectsTsvService.flattenProjectField(key, project[key]))
      .join('\t');
  }

  private static flattenProjectField(key: string, value) {
    if (!value && value !== 0) {
      return '';
    }
    if (key === 'authors') {
      return value.map((author) => author.formattedName).join(', ');
    }
    if (key === 'publications') {
      return value
        .map(
          (publication) => `[${publication.journalTitle}](${publication.url})`
        )
        .join(', ');
    }
    if (
      [
        'enaAccessions',
        'arrayExpressAccessions',
        'geoAccessions',
        'egaAccessions',
        'dbgapAccessions',
        'cellXGeneLinks',
        'sceaLinks',
        'ucscLinks',
      ].includes(key)
    ) {
      return value.map((link) => link.name).join(', ');
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  }
}
