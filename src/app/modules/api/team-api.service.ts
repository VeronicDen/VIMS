import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SimpleResponse} from "../../models/simple-response";
import {PlayerTeam} from "../../models/user/player-team";

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
  getTeams(): Observable<SimpleResponse<PlayerTeam[]>> {
    return this.httpClient.get<SimpleResponse<PlayerTeam[]>>(this.urlPrime);
  }

  /**
   * Отправляет запрос на создание новой команды
   * @param caption название команды
   */
  setTeam(caption: string): Observable<SimpleResponse<any>> {
    return this.httpClient.post<SimpleResponse<any>>(this.urlPrime, {caption});
  }

  /**
   * Отправляет запрос на участие команды в игре
   * @param game_id идентификатор игры
   * @param teamId идентификатор команды
   */
  applyToGame(game_id: number, teamId: number): Observable<SimpleResponse<any>> {
    return this.httpClient.post<SimpleResponse<any>>(`${this.urlPrime}/${teamId}/apply-to-game`, {game_id});
  }


}
