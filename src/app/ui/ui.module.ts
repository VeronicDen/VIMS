import {APP_INITIALIZER, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UiStyleToggleService} from "./ui-style-toggle.service";
import {LocalStorageService} from "../services/local-storage.service";

export function themeFactory(themeService: UiStyleToggleService) {
  return () => themeService.setThemeOnStart();
}

/**
 * Модуль для работы с темами
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    // LocalStorageService,
    UiStyleToggleService,
    {
      provide: APP_INITIALIZER,
      useFactory: themeFactory,
      deps: [UiStyleToggleService],
      multi: true
    }
  ]
})
export class UiModule { }
