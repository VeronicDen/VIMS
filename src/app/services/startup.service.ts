import {Injectable} from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {Router} from "@angular/router";
import {AuthApiService} from "../modules/api/auth-api.service";
import {CurrentStateService} from "./current-state.service";
import {Observable, of} from "rxjs";
import jwt_decode from "jwt-decode";

/**
 * Сервис запуска приложения
 */
@Injectable()
export class StartupService {

  constructor(
    private localStorageService: LocalStorageService,
    private authApiService: AuthApiService,
    private router: Router,
    private currentStateService: CurrentStateService,
  ) {
  }

  /**
   * Метод восстановления сессии пользователя
   */
  run(): Observable<void> {
    if (this.currentStateService.isUserLoggedIn) {
      return of(void 0);
    }
    if (this.localStorageService.refresh_token) {
      this.currentStateService.isUserLoggedIn = true;
      this.currentStateService.currentUser = jwt_decode(this.localStorageService.token);
    } else {
      //переход по сохраненному параметру
    }
    return of(void 0);
  }
}
