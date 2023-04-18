import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToastComponent} from "./toast.component";

/**
 * Модуль для работы с оповещением
 */
@NgModule({
  declarations: [
    ToastComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToastComponent,
  ],
})
export class ToastModule { }
