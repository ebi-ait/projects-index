import { TestBed } from '@angular/core/testing';

import { AddProjectService } from './add-project.service';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('AddProjectService', () => {
  let service: AddProjectService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = new AddProjectService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should return a valid HTTP response', () => {
    service
      .submitProject({
        doi: 'Hitchikers guide to the galaxy',
        email: 'prostentic@vogonfleet.galaxy',
        name: 'Jeltz',
        comments: `Oh freddled gruntbuggly,Thy micturations are to meAs plurdled
        gabbleblotchits on a lurgid bee.Groop, I implore thee, my foonting
        turlingdromes,And hooptiously drangle me with crinkly bindlewurdles,
        Or I will rend thee in the gobberwartsWith my blurglecruncheon, see if I don't!`,
      })
      .then((res) => {
        expect(res).toBeTruthy();
      });

    const req = httpTestingController.expectOne(
      `${environment.ingestApiUrl}${environment.suggestEndpoint}`
    );
    expect(req.request.method).toEqual('POST');
    req.flush({ foo: 'bar' }, { status: 200, statusText: 'done' });
  });
});
