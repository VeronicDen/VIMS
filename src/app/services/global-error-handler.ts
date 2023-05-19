import {ErrorHandler, Injectable} from '@angular/core';
import {MessageService} from "primeng/api";
import {ToastService} from "./toast.service";

/**
 * Глобальный обработчик ошибок
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private messageService: MessageService,
    private toastService: ToastService,
  ) {}

  handleError(error: any): void {
    /* if (error instanceof ServerError) */
    if ('code' in error) {
      this.toastService.showErrorToast(error.message);
    } else {
      this.toastService.showErrorToast('Произошла ошибка');
    }
  }
}
