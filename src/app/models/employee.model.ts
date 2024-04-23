export interface Employee {
  id?: number;
  code?: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  province_id: string;
  birthDate: Date | string;
  email: string;
  personalObservations: string | null;
  photo: string | null;
  startDate: Date | string;
  position: string;
  department: string;
  employmentProvince: string;
  salary: number;
  partTime: boolean;
  employmentObservations: string | null;
  status?: null;
}
