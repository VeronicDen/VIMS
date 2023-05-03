import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {UiStyleToggleService} from "./ui/ui-style-toggle.service";
import {RouterModule, Routes} from "@angular/router";
import {LocalStorageService} from "./services/local-storage.service";
import {MainPageComponent} from './pages/full-pages/main-page/main-page.component';
import {HeaderModule} from "./components/header/header.module";
import {FooterModule} from "./components/footer/footer.module";
import {AuthDialogComponent} from './pages/dialogs/auth-dialog/auth-dialog.component';
import {RefDirective} from './directives/ref.directive';
import {ProfileComponent} from './pages/full-pages/profile/profile.component';
import {DialogModule} from "./components/dialog/dialog.module";
import {SliderModule} from "./components/slider/slider.module";
import {ChangePasswordDialogComponent} from './pages/dialogs/change-password-dialog/change-password-dialog.component';
import {ReactiveFormsModule} from "@angular/forms";
import {UsersGamesComponent} from './pages/full-pages/users-games/users-games.component';
import {PaginatorModule} from "primeng/paginator";
import {GameCreationComponent} from './pages/full-pages/game-creation/game-creation.component';
import {CommandInGameDialogComponent} from './pages/dialogs/teams-in-game-dialog/teams-in-game-dialog.component';
import {NewTeamDialogComponent} from './pages/dialogs/new-team-dialog/new-team-dialog.component';
import {LevelCreationComponent} from './pages/full-pages/level-creation/level-creation.component';
import {LevelSettingsComponent} from './pages/parts/level-settings/level-settings.component';
import {
  LevelInformationBlocksComponent
} from './pages/parts/level-information-blocks/level-information-blocks.component';
import {ListOfLevelCodesComponent} from './pages/parts/list-of-level-codes/list-of-level-codes.component';
import {DropdownModule} from 'primeng/dropdown';
import {EditorModule} from 'primeng/editor';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CheckboxModule} from "./components/checkbox/checkbox.module";
import {ApiModule} from "./api/api.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "./api/auth.interceptor";
import {StartupService} from "./services/startup.service";
import { IdDirective } from './directives/id.directive';
import { ArrowDivDirective } from './directives/arrow-div.directive';
import { GamePlayComponent } from './pages/full-pages/game-play/game-play.component';
import { HelpPageComponent } from './pages/full-pages/help-page/help-page.component';

export function themeFactory(themeService: UiStyleToggleService) {
  return () => themeService.setThemeOnStart();
}

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'help',
    component: HelpPageComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'game',
    component: GamePlayComponent,
  },
  {
    path: 'games',
    component: UsersGamesComponent,
  },
  {
    path: 'game/:game-id',
    component: GameCreationComponent,
  },
  {
    path: 'game/:game-id/:level-id',
    component: LevelCreationComponent,
    children: [
      {
        path: 'settings',
        component: LevelSettingsComponent,
      },
      {
        path: 'info-blocks',
        component: LevelInformationBlocksComponent,
      },
      {
        path: 'codes',
        component: ListOfLevelCodesComponent,
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  declarations: [
    AppComponent,
    RefDirective,
    MainPageComponent,
    AuthDialogComponent,
    ProfileComponent,
    ChangePasswordDialogComponent,
    UsersGamesComponent,
    GameCreationComponent,
    CommandInGameDialogComponent,
    NewTeamDialogComponent,
    LevelCreationComponent,
    LevelSettingsComponent,
    LevelInformationBlocksComponent,
    ListOfLevelCodesComponent,
    IdDirective,
    ArrowDivDirective,
    GamePlayComponent,
    HelpPageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HeaderModule,
    FooterModule,
    DialogModule,
    SliderModule,
    ReactiveFormsModule,
    PaginatorModule,
    BrowserAnimationsModule,
    DropdownModule,
    EditorModule,
    ConfirmDialogModule,
    CheckboxModule,
    ApiModule,
  ],
  providers: [
    LocalStorageService,
    UiStyleToggleService,
    StartupService,
    ConfirmationService,
    {
      provide: APP_INITIALIZER,
      useFactory: themeFactory,
      deps: [UiStyleToggleService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (startupService: StartupService) => () => startupService.run(),
      deps: [StartupService],
      multi: true
    },
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
