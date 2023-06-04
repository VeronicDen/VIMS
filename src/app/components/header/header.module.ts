import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header.component';
import {RouterModule} from "@angular/router";
import {DirectiveModule} from "../../directives/directive.module";

/**
 * Модуль для работы с хэдером
 */
@NgModule({
  declarations: [
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    DirectiveModule,
  ],
  exports: [
    HeaderComponent,
  ],
})
export class HeaderModule {
}
