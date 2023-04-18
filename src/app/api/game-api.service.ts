import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SimpleResponse} from "../models/simple-response";
import {Game} from "../models/admin-game/game";
import {Level} from "../models/admin-game/level";
import {Infos} from "../models/admin-game/infos";
import {Code} from "../models/admin-game/code";
import {Response} from "../models/response";

/**
 * Сервис для отправки запросов игр
 */
@Injectable()
export class GameApiService {

  /** Базовый URL */
  urlPrime: string = environment.baseUrl + '/server/api/admin/games';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  /**
   * Отправляет запрос для получения списка игр
   */
  getGames(): Observable<SimpleResponse<Game[]>> {
    return this.httpClient.get<SimpleResponse<Game[]>>(this.urlPrime);
  }

  /**
   * Отправляет запрос на получение информации об игре
   * @param id идентификатор игры
   */
  getGame(id: number): Observable<SimpleResponse<Game>> {
    return this.httpClient.get<SimpleResponse<Game>>(`${this.urlPrime}/${id}`);
  }

  /**
   * Отправляет запрос на создание новой игры
   * @param caption название игры
   */
  setGame(caption: string): Observable<SimpleResponse<any>> {
    return this.httpClient.post<SimpleResponse<any>>(this.urlPrime, {caption});
  }

  /**
   * Отправляет запрос на изменение основной информации об игре
   * @param gameId идентификатор игры
   * @param caption название игры
   * @param game_yaml основной скрипт
   */
  putGame(gameId: number, caption: string, game_yaml: string): Observable<SimpleResponse<any>> {
    return this.httpClient.put<SimpleResponse<any>>(`${this.urlPrime}/${gameId}`, {caption, game_yaml});
  }

  /**
   * Отправляет запрос для получения списка уровней игры
   * @param id идентификатор игры
   */
  getLevels(id: number): Observable<SimpleResponse<Level[]>> {
    return this.httpClient.get<SimpleResponse<Level[]>>(`${this.urlPrime}/${id}/levels`);
  }

  /**
   * Отправляет запрос на получение информации об уровне
   * @param gameId идентификатор игры
   * @param levelId идентификатор уровня
   */
  getLevel(gameId: number, levelId: number): Observable<SimpleResponse<Level>> {
    return this.httpClient.get<SimpleResponse<Level>>(`${this.urlPrime}/${gameId}/levels/${levelId}`);
  }

  /**
   * Отправляет запрос на создание нового уровня
   * @param level информация об уровне
   * @param id идентификатор игры
   */
  setLevel(level: Level, id: number): Observable<SimpleResponse<Level>> {
    return this.httpClient.post<SimpleResponse<Level>>(`${this.urlPrime}/${id}/levels`, level);
  }

  /**
   * Отправляет запрос на изменение уровня
   * @param level инфомация об уровне
   * @param gameId идентификатор игры
   * @param levelId идентификатор уровня
   */
  putLevel(level: Level, gameId: number, levelId: number): Observable<Response<any>> {
    return this.httpClient.put<Response<any>>(`${this.urlPrime}/${gameId}/levels/${levelId}`, level);
  }

  /**
   * Отправляет запрос на удаление уровня игры
   * @param gameId идентификатор игры
   * @param levelId идентификатор уровня
   */
  deleteLevel(gameId: number, levelId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.urlPrime}/${gameId}/levels/${levelId}`);
  }

  /**
   * Отправляет запрос на получения блоков информации
   * @param gameId идентификатор игры
   * @param levelId идентификатор уровня
   */
  getInfoBlocks(gameId: number, levelId: number): Observable<SimpleResponse<Infos[]>> {
    return this.httpClient.get<SimpleResponse<Infos[]>>(`${this.urlPrime}/${gameId}/levels/${levelId}/infos`);
  }

  /**
   * Отправляет запрос на создание нового блока информации
   * @param gameId идентификатор игры
   * @param levelId идентификатор уровня
   * @param infoBlock блок информации
   */
  setInfoBlock(gameId: number, levelId: number, infoBlock: Infos): Observable<SimpleResponse<any>> {
    return this.httpClient.post<SimpleResponse<any>>(`${this.urlPrime}/${gameId}/levels/${levelId}/infos`, infoBlock)
  }

  /**
   * Отправляет запрос на изменение блока информации
   * @param gameId идентификатор игры
   * @param levelId идентификатор уровня
   * @param infoId идентификатор блока
   * @param infoBlock блок информации
   */
  putInfoBlock(gameId: number, levelId: number, infoId: number, infoBlock: Infos): Observable<SimpleResponse<any>> {
    return this.httpClient.put<SimpleResponse<any>>(`${this.urlPrime}/${gameId}/levels/${levelId}/infos/${infoId}`, infoBlock)
  }

  /**
   * Отправляет запрос на удаление блока информации
   * @param gameId идентификатор игры
   * @param levelId идентификатор уровня
   * @param infoId идентификатор блока
   */
  deleteInfoBlock(gameId: number, levelId: number, infoId: number): Observable<SimpleResponse<any>> {
    return this.httpClient.delete<SimpleResponse<any>>(`${this.urlPrime}/${gameId}/levels/${levelId}/infos/${infoId}`);
  }

  /**
   * Отправляет запрос на получение кодов
   * @param gameId идентификатор игры
   * @param levelId идентификатор уровня
   */
  getCodes(gameId: number, levelId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.urlPrime}/${gameId}/levels/${levelId}/codes`);
  }

  /**
   * Отправляет запрос на создание кода
   * @param gameId идентификатор игры
   * @param levelId идентификатор уровня
   * @param code код
   */
  setCode(gameId: number, levelId: number, code: Code[]): Observable<SimpleResponse<Code[]>> {
    return this.httpClient.post<SimpleResponse<Code[]>>(`${this.urlPrime}/${gameId}/levels/${levelId}/codes`, {codes: code});
  }

  /**
   * Подтверждает участие команды в игре
   * @param gameId идентификатор игры
   * @param gameTeamId идентификатор уровня
   */
  acceptTeam(gameId: number, gameTeamId: number): Observable<SimpleResponse<any>> {
    return this.httpClient.post<SimpleResponse<any>>(`${this.urlPrime}/${gameId}/teams/${gameTeamId}/accept`, {});
  }

  /**
   * Отказывает команде в участии в игре
   * @param gameId идентификатор игры
   * @param gameTeamId идентификатор уровня
   */
  rejectTeam(gameId: number, gameTeamId: number): Observable<SimpleResponse<any>> {
    return this.httpClient.post<SimpleResponse<any>>(`${this.urlPrime}/${gameId}/teams/${gameTeamId}/reject`, {});
  }
}
