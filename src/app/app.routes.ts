import { Routes } from '@angular/router';
import { ListEmployeesComponent } from './pages/list-employees/list-employees.component';
import { CreateEmployeeFormComponent } from './pages/create-employee-form/create-employee-form.component';
import { ReportEmployeesComponent } from './pages/report-employees/report-employees.component';

export const routes: Routes = [
  { path: 'list-employees', component: ListEmployeesComponent },
  { path: 'create-employee', component: CreateEmployeeFormComponent },
  { path: 'edit-employee/:id', component: CreateEmployeeFormComponent },
  { path: 'report-employees', component: ReportEmployeesComponent },
  { path: '', redirectTo: '/list-employees', pathMatch: 'full' },
];
