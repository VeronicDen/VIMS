import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {AuthApiService} from "./auth-api.service";
import {TeamApiService} from "./team-api.service";
import {GameApiService} from "./game-api.service";

/**
 * Модуль для работы с сервером
 */
@NgModule({
  providers: [
    AuthApiService,
    TeamApiService,
    GameApiService,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
  ]
})
export class ApiModule { }
