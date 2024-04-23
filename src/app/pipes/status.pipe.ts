import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../enums/status.enum'; // Asegúrate de que la ruta sea correcta

@Pipe({
  name: 'statusPipe',
  standalone: true,
})
export class StatusPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value == null) {
      return 'Not assigned';
    }
    return Status[value];
  }
}
