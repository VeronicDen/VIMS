import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArrowDivDirective} from "./arrow-div.directive";
import {IdDirective} from "./id.directive";
import {RefDirective} from "./ref.directive";

@NgModule({
  declarations: [
    ArrowDivDirective,
    IdDirective,
    RefDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ArrowDivDirective,
    IdDirective,
    RefDirective
  ]
})
export class DirectiveModule { }
