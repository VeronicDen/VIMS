import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SliderComponent} from "./slider.component";

/**
 * Модуль для работы со слайдером
 */
@NgModule({
  declarations: [
    SliderComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SliderComponent,
  ],
})
export class SliderModule { }
