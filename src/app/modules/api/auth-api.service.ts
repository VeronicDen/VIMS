import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {LoginBody} from "../../models/auth/login-body";
import {Observable} from "rxjs";
import {RegistrationBody} from "../../models/auth/registration-body";
import {LoginResponseBody} from "../../models/auth/login-response-body";
import {Response} from "../../models/response";

/**
 * Сервис для отправки запросов авторизации
 */
@Injectable()
export class AuthApiService {

  /** Базовый URL */
  urlPrime: string = environment.baseUrl + '/server/api/users/';

  constructor(
    private httpClient: HttpClient,
  ) { }

  /**
   * Отправляет запрос для авторизации пользователя
   * @param user информация для авторизации
   */
  authUser(user: LoginBody): Observable<Response<LoginResponseBody>> {
    return this.httpClient.post<Response<LoginResponseBody>>(this.urlPrime + `sign-in`, user);
  }

  /**
   * Отправляет запрос для регистрации пользователя
   * @param user информация для регистрации
   */
  registerUser(user: RegistrationBody): Observable<string> {
    return this.httpClient.post<string>(this.urlPrime + 'sign-up', user);
  }

  /**
   * Получает обновленные токены
   * @param refresh_token токен для обновления
   */
  getRefreshToken(refresh_token: string): Observable<LoginResponseBody> {
    return this.httpClient.post<LoginResponseBody>(this.urlPrime + 'refresh-access', refresh_token);
  }
}
