import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { EmployeesService } from '../../services/employees.service';
import { Employee } from '../../models/employee.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StatusPipe } from '../../pipes/status.pipe';

@Component({
  selector: 'app-list-employees',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    StatusPipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [EmployeesService],
  templateUrl: './list-employees.component.html',
  styleUrl: './list-employees.component.scss',
})
export class ListEmployeesComponent implements OnInit {
  isLoading: boolean = false;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 15;
  searchName: string = '';
  searchCode: string = '';

  constructor(private employeesService: EmployeesService) {
    this.loadEmployees();
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading = true;
    this.employeesService.list().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.isLoading = false;
      },
    });
  }

  get paginatedEmployees(): Employee[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, endIndex);
  }

  nextPage(event: MouseEvent) {
    event.preventDefault();
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  previousPage(event: MouseEvent) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  changePage(event: MouseEvent, page: number) {
    event.preventDefault();
    this.currentPage = page;
  }

  totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  filterEmployees() {
    this.filteredEmployees = this.employees.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();

      return (
        (!this.searchName ||
          fullName.includes(this.searchName.toLowerCase())) &&
        (!this.searchCode || emp.code!.includes(this.searchCode))
      );
    });
  }
}
