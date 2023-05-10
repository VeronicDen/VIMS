import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SimpleResponse} from "../models/simple-response";
import {CodeForSend} from "../models/user/code-for-send";
import {ActionGame} from "../models/user/action-game";
import {Response} from "../models/response";

/**
 * Сервис для отправки запросов запущенных игр
 */
@Injectable({
  providedIn: 'root'
})
export class ActionApiService {

  /** Базовый URL */
  urlPrime: string = environment.baseUrl + '/server/api/action/game';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  /**
   * Отправляет запрос на подключение к игре и получение токена
   * @param gameId идентификатор игры
   */
  submitRequestToGame(gameId: number): Observable<SimpleResponse<SimpleResponse<string>>> {
    return this.httpClient.post<SimpleResponse<SimpleResponse<string>>>(`${this.urlPrime}/${gameId}/enter`, {});
  }

  /**
   * Отправляет запрос на получение информации об игре
   * @param token токен
   */
  enterTheGame(token: string): Observable<Response<ActionGame>> {
    return this.httpClient.get<Response<ActionGame>>(this.urlPrime + '/info', {headers: {'game-token': token}});
  }

  /**
   * Отправляет код
   * @param token токен
   * @param code код
   */
  sendCode(token: string, code: CodeForSend): Observable<SimpleResponse<any>> {
    return this.httpClient.post<SimpleResponse<any>>(this.urlPrime + '/codes/send', code, {headers: {'game-token': token}})
  }
}
