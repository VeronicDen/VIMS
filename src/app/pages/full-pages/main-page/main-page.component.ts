import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
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

  isCurrentGamesChose: boolean = true;

  /** Ассоциативный массив флагов открытия игр */
  isGameOpenMap = new Map<PlayerGame, boolean>();

  /** Ассоциативный массив флагов открытия игр */
  isGameUnlockedMap = new Map<number, boolean>();

  /** Список команд для выпадающего меню */
  teams: Option<string>[] = [];

  /** Команда, выбранная из списка */
  selectedTeam: string;

  @ViewChild(RefDirective)
  refDir: RefDirective

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private currentStateService: CurrentStateService,
    private teamApiService: TeamApiService,
    private userApiService: UserApiService,
    private actionApiService: ActionApiService,
    private localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit(): void {
    this.getActualInfo()
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

    this.userApiService.getActualGames().subscribe(response => {
      this.games = response.res.sort(
        (a, b) => moment(a.creation_date) < moment(b.creation_date) ? -1 : 1);

      for (const game of this.games) {
        this.isGameOpenMap.set(game, false);
      }

      if (this.currentStateService.isUserLoggedIn) {
        this.user = this.currentStateService.currentUser;
        this.teams = [];

        this.teamApiService.getTeams().subscribe(response => {
          for (const team of response.res) {
            this.teams.push({name: team.caption, code: String(team.id)});
          }
          if (this.teams.length != 0)
            this.selectedTeam = this.teams[0].code;

          this.setGameUnlockedMap();
        });
      }
    })
  }

  /**
   * Регистрирует пользователя на игру
   * @param gameId идентификатор игры
   */
  applyOrGoToTheGame(gameId: number): void {
    if (this.user) {
      if (this.isGameUnlockedMap.get(gameId)) {
        if (this.games.find(a => a.id == gameId).game_state == 'started') {
          this.actionApiService.submitRequestToGame(gameId).subscribe(response => {
            this.localStorageService.game_token = response.res.res;
            this.router.navigate(['game']);
          })
        }
      } else {
        this.teamApiService.applyToGame(gameId, +this.selectedTeam).subscribe(response => {
          this.getActualInfo();
        })
      }
    } else
      this.showAuthDialog(false);
  }

  /**
   * Заполняет ассоциативный массив разблокированных игр
   */
  setGameUnlockedMap(): void {
    for (const game of this.games) {
      // TODO: сделать фильтрацию по датам
      this.isGameUnlockedMap.set(game.id, false);
      if (this.selectedTeam) {
        this.isGameUnlockedMap.set(game.id, !!game.teams.find(a => a.id == this.selectedTeam));
      }
    }
  }

  /**
   * Назначает текст кнопки игры
   * @param gameId идентификатор игры
   */
  setGameButtonState(gameId: number): string {
    if (this.user && this.isGameUnlockedMap.get(gameId)) {
      if (this.games.find(a => a.id == gameId).game_state == 'started')
        return 'ПЕРЕЙТИ';
      else {
        if (this.games.find(a => a.id == gameId).teams.find(a => a.id == this.selectedTeam).accepted == 1)
          return 'ВЫ ЗАРЕГИСТРИРОВАНЫ';
        else
          return 'ВЫ ПОДАЛИ ЗАЯВКУ';
      }
    } else
      return 'ЗАРЕГИСТРИРОВАТЬСЯ';
  }

  choseGames(isCurGames: boolean) {
    this.isCurrentGamesChose = isCurGames;
    //TODO: сделать фильтрацию по датам
  }
}
