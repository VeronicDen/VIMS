import {Component, ComponentFactoryResolver, OnInit, ViewChild,} from '@angular/core';
import {AuthDialogComponent} from "../../dialogs/auth-dialog/auth-dialog.component";
import {RefDirective} from "../../../directives/ref.directive";
import {CurrentStateService} from "../../../services/current-state.service";
import {User} from "../../../models/auth/user";
import {NewTeamDialogComponent} from "../../dialogs/new-team-dialog/new-team-dialog.component";
import {Option} from "../../../models/option";
import {TeamApiService} from "../../../api/team-api.service";
import {UserApiService} from "../../../api/user-api.service";
import {PlayerGame} from "../../../models/user/player-game";
import * as moment from "moment";
import {ActionApiService} from "../../../api/action-api.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../../services/local-storage.service";
import {finalize, mergeMap, of} from "rxjs";
import {GameButtonsName} from "../../../models/enums/game-buttons-name";

/**
 * Стартовая страница
 */
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  /** Информация о пользователе */
  user: User;

  /** Массив игр */
  games: PlayerGame[] = [];

  /** Флаг выбора текущих игр */
  isCurrentGamesChose: boolean = true;

  /** Ассоциативный массив флагов открытия игр */
  isGameOpenMap = new Map<PlayerGame, boolean>;

  /** Ассоциативный массив названий кнопок */
  gameButtonNameMap = new Map<number, string>();

  /** Список команд для выпадающего меню */
  teams: Option<string>[] = [];

  /** Команда, выбранная из списка */
  selectedTeam: string;

  @ViewChild(RefDirective)
  refDir: RefDirective

  constructor(
    private actionApiService: ActionApiService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private currentStateService: CurrentStateService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private teamApiService: TeamApiService,
    private userApiService: UserApiService,
  ) {
  }

  ngOnInit(): void {
    this.getActualInfo();
  }

  /**
   * Открывает диалоговое окно авторизации
   * @param isRegistration флаг открытия окна регистрации
   */
  showAuthDialog(isRegistration: boolean): void {
    const modalFactory = this.componentFactoryResolver.resolveComponentFactory(AuthDialogComponent);
    this.refDir.viewContainerRef.clear();

    this.currentStateService.isDialogOpened = true;

    const component = this.refDir.viewContainerRef.createComponent(modalFactory);

    component.instance.isRegistration = isRegistration;
    component.instance.close.subscribe(() => {
      this.refDir.viewContainerRef.clear();
      this.getActualInfo();
      this.currentStateService.isDialogOpened = false;
    })
  }

  /**
   * Открывает диалоговое окно создания новой команды
   */
  showNewTeamDialog(): void {
    const modalFactory = this.componentFactoryResolver.resolveComponentFactory(NewTeamDialogComponent);
    this.refDir.viewContainerRef.clear();

    this.currentStateService.isDialogOpened = true;

    const component = this.refDir.viewContainerRef.createComponent(modalFactory);

    component.instance.close.subscribe(() => {
      this.refDir.viewContainerRef.clear();
      this.getActualInfo();
      this.currentStateService.isDialogOpened = false;
    })
  }

  /**
   * Получает актуальную информацию
   */
  getActualInfo(): void {
    this.isGameOpenMap = new Map<PlayerGame, boolean>();

    this.userApiService.getActualGames().pipe(
      mergeMap(response => {
        this.games = response.res.sort(
          (a, b) => moment(a.creation_date) < moment(b.creation_date) ? -1 : 1);

        for (const game of this.games) {
          this.isGameOpenMap.set(game, false);
        }

        if (!this.currentStateService.isUserLoggedIn) {
          return of(null);
        }
        this.user = this.currentStateService.currentUser;
        this.teams = [];

        return this.teamApiService.getTeams();
      }),
      finalize(() => this.setGameButtonNameMap())
    ).subscribe(response => {
      if (!response) {
        return;
      }
      for (const team of response.res) {
        this.teams.push({name: team.caption, code: String(team.id)});
      }
      if (this.teams.length != 0)
        this.selectedTeam = this.teams[0].code;
    })
  }

  /**
   * Регистрирует пользователя на игру или открывает страницу запущеной
   * @param gameId идентификатор игры
   */
  applyOrGoToTheGame(gameId: number): void {
    if (this.gameButtonNameMap.get(gameId) == GameButtonsName.preregistration)
      this.teamApiService.applyToGame(gameId, +this.selectedTeam).subscribe(() => this.getActualInfo());
    else if (this.gameButtonNameMap.get(gameId) == GameButtonsName.ready) {
      this.actionApiService.submitRequestToGame(gameId).subscribe(response => {
        this.localStorageService.game_token = response.res.res;
        this.router.navigate(['game']);
      })
    }
  }


  /**
   * Заполняет ассоциативный массив названий кнопок
   */
  setGameButtonNameMap(): void {
    this.gameButtonNameMap = new Map<number, string>();
    for (const game of this.games) {
      // TODO: сделать фильтрацию по датам

      if (!this.user)
        this.gameButtonNameMap.set(game.id, GameButtonsName.preregistration);
      else {
        if (game.teams.some(a => a.id == +this.selectedTeam)) {
          if (game.teams.some(a => a.id == +this.selectedTeam && a.accepted == 1)) {
            if (game.game_state == 'started')
              this.gameButtonNameMap.set(game.id, GameButtonsName.ready);
            else
              this.gameButtonNameMap.set(game.id, GameButtonsName.approved);
          }
          else
            this.gameButtonNameMap.set(game.id, GameButtonsName.submitted);
        } else {
          this.gameButtonNameMap.set(game.id, GameButtonsName.preregistration);
        }
      }
    }
  }

  choseGames(isCurGames: boolean) {
    this.isCurrentGamesChose = isCurGames;
    //TODO: сделать фильтрацию по датам
  }

  getAuthors(authors: { login: string; role: string; user_id: number }[]): string {
    let result = '';
    for (const author of authors) {
      if (author.role == 'CREATOR')
        result += result == '' ? author.login : ', ' + author.login;
    }
    return result;
  }
}
