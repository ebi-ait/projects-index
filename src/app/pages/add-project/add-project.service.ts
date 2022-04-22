import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddProjectService {
  URL = `${environment.ingestApiUrl}${environment.suggestEndpoint}`;

  constructor(private http: HttpClient) {}

  async submitProject(suggestion: {
    doi: string;
    email: string;
    name: string;
    comments: string;
  }) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return firstValueFrom(this.http.post(this.URL, suggestion, httpOptions));
  }
}
