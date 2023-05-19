import {Injectable, NgZone} from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable()
export class ToastService {

  constructor(
    private messageService: MessageService,
    private ngZone: NgZone,
  ) {
  }

  showSuccessToast(message: string): void {
    this.ngZone.run(() => {
      this.messageService.add({severity: 'success', detail: message, life: 3000});
    })
  }

  showErrorToast(message: string): void {
    this.ngZone.run(() => {
      this.messageService.add({severity: 'error', detail: message, life: 10000});
    })
  }
}
