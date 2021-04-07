import { Injectable, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService, private zone: NgZone) {}

  showError(message: string): void {
    this.zone.run(() => {
      this.toastr.error(message, '', {
        closeButton: true,
        timeOut: 20000,
        enableHtml: true,
        tapToDismiss: true
      });
    });
  }
}
