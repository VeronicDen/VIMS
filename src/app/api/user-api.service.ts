import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Response} from "../models/response";
import {PlayerGame} from "../models/user/player-game";

/**
 * Сервис для отправки запросов пользователя
 */
@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  /** Базовый URL */
  urlPrime: string = environment.baseUrl + '/server/api/';

  constructor(
    private httpClient: HttpClient,
  ) { }

  /**
   * Отправляет запрос для получения текущих игр
   */
  getActualGames(): Observable<Response<PlayerGame[]>> {
    return this.httpClient.get<Response<PlayerGame[]>>(this.urlPrime + 'games')
  }
}
