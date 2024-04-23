import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Province } from '../models/province.model';
import { environment } from '../environments/environment';

@Injectable()
export class ProvincesService {
  private baseUrl = environment.apiUrl + '/provinces';

  constructor(private http: HttpClient) {}

  list(): Observable<Province[]> {
    return this.http.get<Province[]>(`${this.baseUrl}`);
  }
}
