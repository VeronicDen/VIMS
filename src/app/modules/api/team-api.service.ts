import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SimpleResponse} from "../../models/simple-response";
import {Team} from "../../models/team";

/**
 * Сервис для отправки запросов команд
 */
@Injectable()
export class TeamApiService {

  /** Базовый URL */
  urlPrime: string = environment.baseUrl + '/server/api/teams';

  constructor(
    private httpClient: HttpClient,
  ) { }

  /**
   * Отправляет запрос для получения списка команд
   */
  getTeams(): Observable<SimpleResponse<Team[]>> {
    return this.httpClient.get<SimpleResponse<Team[]>>(this.urlPrime);
  }

  /**
   * Отправляет запрос на создание новой команды
   * @param caption название команды
   */
  setTeam(caption: string): Observable<SimpleResponse<any>> {
    return this.httpClient.post<SimpleResponse<any>>(this.urlPrime, {caption});
  }
}
