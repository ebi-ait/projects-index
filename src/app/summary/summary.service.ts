import {Injectable, OnDestroy} from '@angular/core';
import {map} from "rxjs/operators";
import {Subject} from "rxjs";
import {ProjectsService} from "../projects/services/projects.service";

export interface ProjectCount {
  group: string;
  count: number;
  cellCount: number;
}

@Injectable({
              providedIn: 'root'
            })
export class SummaryService implements OnDestroy {

  private projectsByOrgan = new Subject<ProjectCount[]>();
  projectsByOrgan$ = this.projectsByOrgan.asObservable();

  private projectsByTech = new Subject<ProjectCount[]>();
  projectsByTech$ = this.projectsByTech.asObservable();

  private cellCount = new Subject<number>();
  cellCount$ = this.cellCount.asObservable();

  constructor(private projectService: ProjectsService) {
    this.groupProjectsByKey('organs', this.projectsByOrgan);
    this.groupProjectsByKey('technologies', this.projectsByTech);
    this.projectService.getAllProjects()
        .pipe(map(projects => projects.map(x => x.cellCount)))
        .subscribe(projects => this.cellCount.next(projects.reduce((acc, val) => acc + val, 0)));
  }

  groupProjectsByKey(key: string, subject: Subject<any>) : void  {
    this.projectService.getAllProjects()
        .pipe(
          map(projects => {
            let groupedProjects = this.groupListByKey(projects, key);
            let data: ProjectCount[] = [];
            this.sortByValue(groupedProjects)
                ?.forEach(([key, value]) => {
                  data.push({
                              count: value.count,
                              cellCount: value.cellCount,
                              group: key
                            });
                });
            return data;
          })
        )
        .subscribe(x => subject.next(x),
                   x => subject.error(x));
  }

  ngOnDestroy() {
    this.projectsByOrgan.complete();
    this.projectsByTech.complete();
  }

  private sortByValue(groupedProjects: { [p: string]: any }) {
    return Object.entries(groupedProjects)
                 ?.sort(([k1, v1], [k2, v2]) => v2.count - v1.count);
  }

  private groupListByKey(list: any[], groupKey: string) {
    return list?.reduce((acc, val) => {
      val[groupKey].forEach((key => {
        if (!acc[key]) {
          acc[key] = {count: 0, cellCount: 0};
        }
        acc[key].count += 1;
        acc[key].cellCount += val.cellCount;
      }));
      return acc;
    }, {});
  }
}
