import {GamePlayComponent} from './pages/full-pages/game-play/game-play.component';
import {HelpPageComponent} from './pages/full-pages/help-page/help-page.component';
import {ToastModule} from 'primeng/toast';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {ApiModule} from "./api/api.module";
import {AppComponent} from './app.component';
import {AuthDialogComponent} from './pages/dialogs/auth-dialog/auth-dialog.component';
import {AuthInterceptor} from "./api/auth.interceptor";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from '@angular/platform-browser';
import {ChangePasswordDialogComponent} from './pages/dialogs/change-password-dialog/change-password-dialog.component';
import {CheckboxModule} from "./components/checkbox/checkbox.module";
import {CommandInGameDialogComponent} from './pages/dialogs/teams-in-game-dialog/teams-in-game-dialog.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CurrentStateService} from "./services/current-state.service";
import {DialogModule} from "./components/dialog/dialog.module";
import {DropdownModule} from 'primeng/dropdown';
import {EditorModule} from 'primeng/editor';
import {FooterModule} from "./components/footer/footer.module";
import {GameCreationComponent} from './pages/full-pages/game-creation/game-creation.component';
import {GlobalErrorHandler} from "./services/global-error-handler";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HeaderModule} from "./components/header/header.module";
import {LevelCreationComponent} from './pages/full-pages/level-creation/level-creation.component';
import {LevelInformationBlocksComponent} from './pages/parts/level-information-blocks/level-information-blocks.component';
import {LevelSettingsComponent} from './pages/parts/level-settings/level-settings.component';
import {ListOfLevelCodesComponent} from './pages/parts/list-of-level-codes/list-of-level-codes.component';
import {LocalStorageService} from "./services/local-storage.service";
import {MainPageComponent} from './pages/full-pages/main-page/main-page.component';
import {NewTeamDialogComponent} from './pages/dialogs/new-team-dialog/new-team-dialog.component';
import {OpenStreetMapService} from "./services/open-street-map.service";
import {PaginatorModule} from "primeng/paginator";
import {ProfileComponent} from './pages/full-pages/profile/profile.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {SliderModule} from "./components/slider/slider.module";
import {StartupService} from "./services/startup.service";
import {UiStyleToggleService} from "./ui/ui-style-toggle.service";
import {UsersGamesComponent} from './pages/full-pages/users-games/users-games.component';
import {ToastService} from "./services/toast.service";
import {DirectiveModule} from "./directives/directive.module";

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
    AuthDialogComponent,
    ChangePasswordDialogComponent,
    CommandInGameDialogComponent,
    GameCreationComponent,
    GamePlayComponent,
    HelpPageComponent,
    LevelCreationComponent,
    LevelInformationBlocksComponent,
    LevelSettingsComponent,
    ListOfLevelCodesComponent,
    MainPageComponent,
    NewTeamDialogComponent,
    ProfileComponent,
    UsersGamesComponent,
  ],
  imports: [
    ApiModule,
    BrowserAnimationsModule,
    BrowserModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    DirectiveModule,
    DropdownModule,
    EditorModule,
    FooterModule,
    HeaderModule,
    PaginatorModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    SliderModule,
    ToastModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    CurrentStateService,
    LocalStorageService,
    OpenStreetMapService,
    StartupService,
    UiStyleToggleService,
    ToastService,
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
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
