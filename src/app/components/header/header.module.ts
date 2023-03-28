import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import {RouterModule} from "@angular/router";

/**
 * Модуль для работы с хэдером
 */
@NgModule({
  declarations: [
    HeaderComponent,
  ],
    imports: [
        CommonModule,
        RouterModule
    ],
  exports: [
    HeaderComponent,
  ]
})
export class HeaderModule { }
