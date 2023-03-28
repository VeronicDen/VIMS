import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';

/**
 * Модуль для работы с диалогом
 */
@NgModule({
  declarations: [
    DialogComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DialogComponent
  ],
})
export class DialogModule { }
