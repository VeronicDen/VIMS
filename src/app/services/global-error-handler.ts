import {ErrorHandler, Injectable} from '@angular/core';
import {MessageService} from "primeng/api";
import {ToastService} from "./toast.service";
import {ServerError} from "../shared/server-error";

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
    console.log(error);
    if (error instanceof ServerError) {
      this.toastService.showErrorToast(error.message);
    } else {
      this.toastService.showErrorToast('Произошла ошибка');
    }
  }
}
