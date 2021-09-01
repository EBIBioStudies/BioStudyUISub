import { Injectable, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  settings = { closeButton: true, timeOut: 20000, enableHtml: true, tapToDismiss: true };

  constructor(private toastr: ToastrService, private zone: NgZone) {}

  showError(message: string): void {
    this.zone.run(() => {
      this.toastr.error(message, '', this.settings);
    });
  }

  showInfo(message: string): void {
    this.zone.run(() => {
      this.toastr.info(message, '', this.settings);
    });
  }
}
