import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import {FormsModule} from "@angular/forms";

/**
 * Модуль для работы с чекбоксом
 */
@NgModule({
  declarations: [
    CheckboxComponent,
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    CheckboxComponent,
  ]
})
export class CheckboxModule { }
