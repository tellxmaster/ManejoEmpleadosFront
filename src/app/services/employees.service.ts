import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { environment } from '../environments/environment';

@Injectable()
export class EmployeesService {
  private baseUrl = environment.apiUrl + '/employees';

  constructor(private http: HttpClient) {}

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  list(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}`);
  }

  create(formData: FormData): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}`, formData);
  }

  update(formData: FormData, id: number): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/${id}`, formData);
  }
}
