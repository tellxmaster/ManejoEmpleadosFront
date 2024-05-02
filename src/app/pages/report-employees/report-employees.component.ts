import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../models/employee.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort } from '@angular/material/sort';
import { RouterLink } from '@angular/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { EmployeesService } from '../../services/employees.service';
import { HttpClientModule } from '@angular/common/http';
import { ProvincesService } from '../../services/provinces.service';
import { Province } from '../../models/province.model';

@Component({
  selector: 'app-report-employees',
  standalone: true,
  imports: [
    MatMenuModule,
    DateFormatPipe,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterLink,
    HttpClientModule,
  ],
  providers: [EmployeesService, ProvincesService],
  templateUrl: './report-employees.component.html',
  styleUrl: './report-employees.component.scss',
})
export class ReportEmployeesComponent implements AfterViewInit {
  isLoading: boolean = false;
  provinces: Province[] = [];
  employees: Employee[] = [];
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'idNumber',
    'province_id',
    'birthDate',
    'email',
    'startDate',
    'position',
    'department',
    'employmentProvince',
    'partTime',
  ];
  allColumns: string[] = [
    'firstName',
    'lastName',
    'idNumber',
    'province_id',
    'birthDate',
    'email',
    'startDate',
    'position',
    'department',
    'employmentProvince',
    'partTime',
  ];
  columnNames = [
    { id: 'firstName', name: 'Nombres' },
    { id: 'lastName', name: 'Apellidos' },
    { id: 'idNumber', name: 'Cédula' },
    { id: 'province_id', name: 'Provincia' },
    { id: 'birthDate', name: 'Fecha Nacimiento' },
    { id: 'email', name: 'Email' },
    { id: 'startDate', name: 'Fecha Inicio' },
    { id: 'position', name: 'Cargo' },
    { id: 'department', name: 'Departamento' },
    { id: 'employmentProvince', name: 'Provincia Empleado' },
    { id: 'partTime', name: 'Jornada Parcial' },
  ];
  dataSource = new MatTableDataSource<Employee>([]);
  currentDate = new Date();
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private employeesService: EmployeesService,
    private provincesService: ProvincesService
  ) {
    this.loadProvinces();
    this.loadEmployees();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  toggleColumn(column: string): void {
    const index = this.displayedColumns.indexOf(column);
    if (index > -1) {
      this.displayedColumns.splice(index, 1);
    } else {
      this.displayedColumns.push(column);
    }
    this.displayedColumns.sort(
      (a, b) => this.allColumns.indexOf(a) - this.allColumns.indexOf(b)
    );
  }

  exportAsPDF() {
    this.isLoading = true;
    html2canvas(document.body).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const timestamp = new Date().toISOString();
      const formattedTimestamp = timestamp.replace(/[-:T.Z]/g, '');
      this.isLoading = false;
      pdf.save(`Reporte-General-Empleados-${formattedTimestamp}.pdf`);
    });
  }

  loadProvinces() {
    this.provincesService.list().subscribe({
      next: (data) => {
        this.provinces = data;
      },
      error: (err) => {
        console.error('Error loading provinces:', err);
      },
    });
  }

  loadEmployees() {
    this.isLoading = true;
    this.employeesService.list().subscribe({
      next: (data) => {
        this.employees = data;
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.isLoading = false;
      },
    });
  }

  getProvinceNameById(id: number): string {
    const province = this.provinces.find((prov) => prov.id === id);
    return province ? province.nombre_provincia : 'Desconocido';
  }
}
