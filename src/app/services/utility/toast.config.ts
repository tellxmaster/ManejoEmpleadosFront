import { ToastrModule, ToastrService } from 'ngx-toastr';

export function getToastrModule() {
  return ToastrModule.forRoot({
    timeOut: 5000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
  });
}
