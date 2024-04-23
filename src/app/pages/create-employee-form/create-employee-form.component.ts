import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProvincesService } from '../../services/provinces.service';
import { EmployeesService } from '../../services/employees.service';
import { Employee } from '../../models/employee.model';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService, ToastNoAnimation } from 'ngx-toastr';

import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Province } from '../../models/province.model';

@Component({
  selector: 'app-create-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgbNavModule,
    CommonModule,
    RouterLink,
    HttpClientModule,
  ],
  providers: [
    ProvincesService,
    EmployeesService,
    ToastrService,
    ToastNoAnimation,
  ],
  templateUrl: './create-employee-form.component.html',
  styleUrl: './create-employee-form.component.scss',
})
export class CreateEmployeeFormComponent implements OnInit {
  isLoading: boolean = false;
  employeeId: number | null = null;
  provinces: Province[] = [];
  constructor(
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private provincesService: ProvincesService,
    private employeesService: EmployeesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loadProvinces();
  }
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('profilePicture') profilePicture!: ElementRef;

  active = 1;
  uploadedFile: File | null = null;
  imageUrl: string = './assets/images/default-photo.png';
  employeeForm!: FormGroup;

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

  ngOnInit(): void {
    this.initializeForm();
    this.loadProvinces();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.employeeId = +id;
        this.loadEmployeeDetails(this.employeeId);
      }
    });
  }

  initializeForm(): void {
    this.employeeForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      idNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      province: new FormControl('', Validators.required),
      birthDate: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      personalObservations: new FormControl(''),
      photo: new FormControl(''), // Placeholder for photo path
      startDate: new FormControl('', Validators.required),
      position: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      department: new FormControl('', Validators.required),
      employmentProvince: new FormControl('', Validators.required),
      salary: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),
      ]),
      partTime: new FormControl('false', Validators.required),
      employmentObservations: new FormControl(''),
    });
  }

  loadEmployeeDetails(id: number): void {
    this.isLoading = true;
    this.employeesService.getEmployeeById(id).subscribe({
      next: (employee: Employee) => {
        const adaptedEmployee = {
          ...employee,
          birthDate: employee.birthDate.toString().substring(0, 10),
          startDate: employee.startDate.toString().substring(0, 10),
        };

        this.employeeForm.patchValue({
          ...adaptedEmployee,
          partTime: adaptedEmployee.partTime ? 'true' : 'false',
        });

        this.profilePicture.nativeElement.src = adaptedEmployee.photo
          ? adaptedEmployee.photo.startsWith('http') ||
            adaptedEmployee.photo.startsWith('https')
            ? adaptedEmployee.photo
            : environment.storageUrl +
              adaptedEmployee.photo.replace('public', 'storage')
          : './assets/images/default-photo.png';

        this.ensureProvincesLoaded(adaptedEmployee);
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error(`Error loading employee: ${err}`, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 3000,
        });

        this.isLoading = false;
      },
    });
  }

  ensureProvincesLoaded(employee: Employee): void {
    if (this.provinces.length > 0) {
      this.employeeForm.get('province')!.setValue(employee.province_id);
      this.employeeForm
        .get('employmentProvince')!
        .setValue(employee.province_id);
    } else {
      this.provincesService.list().subscribe({
        next: (provinces) => {
          this.provinces = provinces;
          this.employeeForm.get('province')!.setValue(employee.province_id);
          this.employeeForm
            .get('employmentProvince')!
            .setValue(employee.province_id);
        },
        error: (err) => {
          console.error('Error loading provinces:', err);
        },
      });
    }
  }

  onSubmit(): void {
    if (!this.employeeForm.valid) {
      this.validateAllFormFields(this.employeeForm);
      return;
    }

    console.log(this.employeeId);
    const formData = this.createFormData(this.employeeForm);

    const requestObservable = this.employeeId
      ? this.employeesService.update(formData, this.employeeId)
      : this.employeesService.create(formData);

    requestObservable.subscribe({
      next: () => {
        this.toastr.success(
          'El registro del empleado se ha actualizado correctamente.',
          'Success!',
          {
            positionClass: 'toast-bottom-right',
            timeOut: 3000,
          }
        );
        setTimeout(() => {
          this.router.navigate(['/list-employees']);
        }, 500);
      },
      error: (err) => {
        console.error('Failed to create/update employee:', err);
        this.toastr.error(
          'Error al crear/actualizar el registro del empleado.',
          'Error!',
          {
            positionClass: 'toast-bottom-right',
            timeOut: 3000,
          }
        );
      },
    });
  }

  private createFormData(form: FormGroup): FormData {
    const formData = new FormData();
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      let value = control?.value;
      console.log(key, value);

      if (key === 'partTime') {
        value = value === 'true' ? 1 : 0;
      } else if (key === 'province') {
        formData.append('province_id', value);
      }

      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }

  changeTab() {
    this.active = this.active === 1 ? 2 : 1;
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      // Actualizar la vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        if (this.profilePicture) {
          this.profilePicture.nativeElement.src = this.imageUrl;
        }
      };
      reader.readAsDataURL(file);
      this.employeeForm.patchValue({ photo: file });
      input.value = '';
    }
  }

  triggerFileInputClick() {
    this.fileInput.nativeElement.click();
  }
}
