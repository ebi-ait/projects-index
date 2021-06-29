import {ChartComponent} from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;


  beforeEach(() => {
    component = new ChartComponent();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  it('should init', () => {
    component.list = [
      {group: 'grp1', count: 111, cellCount: 11111},
      {group: 'grp2', count: 222, cellCount: 22222},
      {group: 'grp3', count: 333, cellCount: 33333},
      {group: 'grp4', count: 444, cellCount: 44444}
    ];
    component.ngOnInit();
    expect(component.barChartLabels).toEqual(['grp1','grp2','grp3','grp4']);
  });

});
