import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from "../../services/local-storage.service";
import {UiStyleToggleService} from "../../ui/ui-style-toggle.service";
import {Router} from "@angular/router";
import {CurrentStateService} from "../../services/current-state.service";
import {AuthDialogComponent} from "../../pages/dialogs/auth-dialog/auth-dialog.component";
import {RefDirective} from "../../directives/ref.directive";

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

  @ViewChild(RefDirective)
  refDir: RefDirective

  constructor(
    private uiStyleToggleService: UiStyleToggleService,
    private localStorageService: LocalStorageService,
    private currentStateService: CurrentStateService,
    private componentFactoryResolver: ComponentFactoryResolver,
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
    if (this.currentStateService.isUserLoggedIn)
      this.router.navigate(isToProfile ? ['/profile'] : ['/games']);
    else {
      const modalFactory = this.componentFactoryResolver.resolveComponentFactory(AuthDialogComponent);
      this.refDir.viewContainerRef.clear();

      this.currentStateService.isDialogOpened = true;

      const component = this.refDir.viewContainerRef.createComponent(modalFactory);

      component.instance.isFromHeader = true;
      component.instance.close.subscribe(() => {
        this.refDir.viewContainerRef.clear();
        this.router.navigate(['']);
        this.currentStateService.isDialogOpened = false;
      })
    }
  }
}
