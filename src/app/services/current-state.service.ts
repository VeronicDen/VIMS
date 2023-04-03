import { Injectable } from '@angular/core';
import {User} from "../models/auth/user";
import {LocalStorageService} from "./local-storage.service";
import {Router} from "@angular/router";
import {Game} from "../models/admin-game/game";

/**
 * Сервис для работы с текущими состояниями
 */
@Injectable({
  providedIn: 'root'
})
export class CurrentStateService {

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {}

  /** Флаг авторизации пользователя */
  isUserLoggedIn: boolean = false;

  /** Информация о текущем пользователе */
  currentUser: User = null;

  /** Флаг открытия диалогового окна */
  isDialogOpened: boolean = false;

  /** Идентификатор открытой игры */
  currentGameId: number;

  /** Идентификатор открытого уровня */
  currentLevelId: number;

  /**
   * Очищает текущие состояния
   */
  clearCurrentState(): void {
    this.isUserLoggedIn = false;
    this.currentUser = null;
    this.localStorageService.dropTokens();
    this.router.navigate([''])
  }
}
