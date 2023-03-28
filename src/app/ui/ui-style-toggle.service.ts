import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LocalStorageService} from "../services/local-storage.service";

export enum ThemeMode {
  DARK,
  LIGHT
}

/**
 * Сервис для работы с темами
 */
@Injectable({
  providedIn: 'root'
})
export class UiStyleToggleService {

  private readonly DARK_THEME_VALUE = 'DARK';
  private readonly LIGHT_THEME_VALUE = 'LIGHT';
  private readonly LIGHT_THEME_CLASS_NAME = 'theme-light';
  private readonly DARK_THEME_CLASS_NAME = 'theme-dark';

  public theme$ = new BehaviorSubject<ThemeMode>(ThemeMode.DARK);

  constructor(
    private localStorageService: LocalStorageService,
  ) { }

  public setThemeOnStart(): void {
    if (this.isLightThemeSelected()) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
    setTimeout(() => {
      document.body.classList.add('animate-colors-transition');
    }, 500);
  }

  public toggle(): void {
    if (this.isLightThemeSelected()) {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

  private isLightThemeSelected(): boolean {
    return this.localStorageService.theme == this.LIGHT_THEME_VALUE;
  }

  private setLightTheme(): void {
    this.localStorageService.theme = this.LIGHT_THEME_VALUE;
    document.body.classList.add(this.LIGHT_THEME_CLASS_NAME);
    document.body.classList.remove(this.DARK_THEME_CLASS_NAME);
    this.theme$.next(ThemeMode.LIGHT);
  }

  private setDarkTheme(): void {
    this.localStorageService.theme = this.DARK_THEME_VALUE;
    document.body.classList.add(this.DARK_THEME_CLASS_NAME);
    document.body.classList.remove(this.LIGHT_THEME_CLASS_NAME);
    this.theme$.next(ThemeMode.LIGHT);
  }
}
