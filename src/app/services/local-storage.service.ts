import { Injectable } from '@angular/core';
import {LocalStorageKeys} from "../shared/local-storage-keys";

/**
 * Сервис для работы с localStorage
 */
@Injectable()
export class LocalStorageService {

  get theme(): string {
    return localStorage.getItem(LocalStorageKeys.THEME);
  }

  set theme(value: string) {
    localStorage.setItem(LocalStorageKeys.THEME, value);
  }

  get token(): string {
    return localStorage.getItem(LocalStorageKeys.TOKEN);
  }

  set token(value: string) {
    localStorage.setItem(LocalStorageKeys.TOKEN, value);
  }

  get refresh_token(): string {
    return localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN);
  }

  set refresh_token(value: string) {
    localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, value);
  }

  dropTokens(): void {
    localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN);
    localStorage.removeItem(LocalStorageKeys.TOKEN);
  }
}
