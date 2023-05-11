import { Injectable } from '@angular/core';
import {LocalStorageKeys} from "../models/enums/local-storage-keys";

/**
 * Сервис для работы с localStorage
 */
@Injectable()
export class LocalStorageService {

  /**
   * Передает тему
   */
  get theme(): string {
    return localStorage.getItem(LocalStorageKeys.THEME);
  }

  /**
   * Устанавливает тему
   * @param value тема
   */
  set theme(value: string) {
    localStorage.setItem(LocalStorageKeys.THEME, value);
  }

  /**
   * Передает токен
   */
  get token(): string {
    return localStorage.getItem(LocalStorageKeys.TOKEN);
  }

  /**
   * Устанавливает токен
   * @param value значение
   */
  set token(value: string) {
    localStorage.setItem(LocalStorageKeys.TOKEN, value);
  }

  /**
   * Передает решреш-токен
   */
  get refresh_token(): string {
    return localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN);
  }

  /**
   * Устанавливает рефреш токен
   * @param value
   */
  set refresh_token(value: string) {
    localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, value);
  }

  /**
   * Передает игровой токен
   */
  get game_token(): string {
    return localStorage.getItem(LocalStorageKeys.GAME_TOKEN);
  }

  /**
   * Устанавливает игровой токен
   * @param value
   */
  set game_token(value: string) {
    localStorage.setItem(LocalStorageKeys.GAME_TOKEN, value);
  }

  /**
   * Удаляет игровой токен
   */
  dropGameToken() {
    localStorage.removeItem(LocalStorageKeys.GAME_TOKEN);
  }

  /**
   * Удаляет обычный и рефреш токены
   */
  dropTokens(): void {
    localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN);
    localStorage.removeItem(LocalStorageKeys.TOKEN);
  }
}
