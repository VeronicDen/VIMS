import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SimpleResponse} from "../models/simple-response";

/**
 * Сервис для отправки запросов запуска игр
 */
@Injectable({
  providedIn: 'root'
})
export class ActionApiService {

  /** Базовый URL */
  urlPrime: string = environment.baseUrl + '/server/api/action/game';

  constructor(
    private httpClient: HttpClient,
  ) { }

  submitRequestToGame(gameId: number): Observable<SimpleResponse<SimpleResponse<string>>> {
    return this.httpClient.post<SimpleResponse<SimpleResponse<string>>>(`${this.urlPrime}/${gameId}/enter`, {});
  }

  enterTheGame(token: string): Observable<SimpleResponse<any>> {
    return this.httpClient.get<SimpleResponse<any>>(this.urlPrime + '/info', {headers: {'game_token': token}});
  }
}
