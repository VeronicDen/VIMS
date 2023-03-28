import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {AuthDialogComponent} from "../../dialogs/auth-dialog/auth-dialog.component";
import {RefDirective} from "../../../directives/ref.directive";
import {CurrentStateService} from "../../../services/current-state.service";
import {User} from "../../../models/auth/user";
import {NewTeamDialogComponent} from "../../dialogs/new-team-dialog/new-team-dialog.component";
import {Option} from "../../../models/option";
import {TeamApiService} from "../../../modules/api/team-api.service";
import {UserApiService} from "../../../modules/api/user-api.service";

interface PlayerGame {
  isUnlocked: boolean;
  game_name: string;
  author: string;
  beginningOfGame: string;
  endOfGame: string;
  description: string;
  id: number;
}

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

  /** Ассоциативный массив флагов открытия игр */
  isGameOpen = new Map<number, boolean>();

  /** Список команд для выпадающего меню */
  teams: Option<string>[] = [];

  /** Команда, выбранная из списка */
  selectedCommand: Option<string>;

  @ViewChild(RefDirective)
  refDir: RefDirective

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private currentStateService: CurrentStateService,
    private teamApiService: TeamApiService,
    private userApiService: UserApiService,
  ) {}

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
    if (this.currentStateService.isUserLoggedIn) {
      this.user = this.currentStateService.currentUser;

      this.teamApiService.getTeams().subscribe(response => {
        for (const team of response.res) {
          this.teams.push({name: team.caption, code: String(team.id)});
        }
      });
    }

    this.games = [{
      id: 30, author: 'trulyalya', game_name: 'Нумерология опустошения II: Декаданс', isUnlocked: false,
      beginningOfGame: '02.08.2022', endOfGame: '03.08.2022', description: '- 20 кодов по меткам\n' +
        '- играет небоян\n' +
        '- в команде до 3 человек\n' +
        '- формат кода: словочисло\n' +
        '- продолжительность ровно 2 часа от старта, опоздавших не ждем'
    },{
      id: 31, author: 'trulyalya', game_name: 'Нумерология опустошения II: Декаданс', isUnlocked: true,
      beginningOfGame: '02.08.2022', endOfGame: '03.08.2022', description: '- 20 кодов по меткам\n' +
        '- играет небоян\n' +
        '- в команде до 3 человек\n' +
        '- формат кода: словочисло\n' +
        '- продолжительность ровно 2 часа от старта, опоздавших не ждем'
    },{
      id: 32, author: 'trulyalya', game_name: 'Нумерология опустошения II: Декаданс', isUnlocked: false,
      beginningOfGame: '02.08.2022', endOfGame: '03.08.2022', description: '- 20 кодов по меткам\n' +
        '- играет небоян\n' +
        '- в команде до 3 человек\n' +
        '- формат кода: словочисло\n' +
        '- продолжительность ровно 2 часа от старта, опоздавших не ждем'
    },]

    for (const game of this.games) {
      this.isGameOpen.set(game.id, false);
    }

    this.userApiService.getActualGames().subscribe(response => {
      //TODO: текущие игры
      //this.games = response.res;
      //console.log(response.res);
    })
  }

  /**
   * Регистрирует пользователя на игру
   * @param gameId идентификатор игры
   */
  registerOrGoToTheGame(gameId: number): void {

  }
}
