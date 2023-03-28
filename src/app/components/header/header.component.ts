import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "../../services/local-storage.service";
import {UiStyleToggleService} from "../../ui/ui-style-toggle.service";
import {Router} from "@angular/router";
import {CurrentStateService} from "../../services/current-state.service";

/**
 * Компонент хэдера
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /** Флаг выбора темной темы */
  isThemeDark: boolean;

  constructor(
    private uiStyleToggleService: UiStyleToggleService,
    private localStorageService: LocalStorageService,
    private currentStateService: CurrentStateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isThemeDark = this.localStorageService.theme == 'DARK';
  }

  /**
   * Меняет тему
   */
  changeTheme(): void {
    this.isThemeDark = !this.isThemeDark;
    this.uiStyleToggleService.toggle();
  }

  /**
   * Осуществляет переход по ссылке
   * @param isToProfile флаг перехода на страницу ПРОФИЛЬ
   */
  followTheLink(isToProfile: boolean): void {
    if (!this.currentStateService.isUserLoggedIn)
      return;
    this.router.navigate(isToProfile ? ['/profile'] : ['/games']);
  }
}
