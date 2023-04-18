import {Component, ComponentFactoryResolver, HostListener, OnInit, ViewChild} from '@angular/core';
import {User} from "../../../models/auth/user";
import {CurrentStateService} from "../../../services/current-state.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RefDirective} from "../../../directives/ref.directive";
import {CommandInGameDialogComponent} from "../../dialogs/teams-in-game-dialog/teams-in-game-dialog.component";
import {GameApiService} from "../../../api/game-api.service";
import {Level} from "../../../models/admin-game/level";
import {Utils} from "../../../shared/utils";
import {Game} from "../../../models/admin-game/game";
import {FormControl, FormGroup} from "@angular/forms";
import {ConfirmationService} from "primeng/api";
import {
  logExperimentalWarnings
} from "@angular-devkit/build-angular/src/builders/browser-esbuild/experimental-warnings";

/**
 * Компонент редактирования игры
 */
@Component({
  selector: 'app-admin-game-creation',
  templateUrl: './game-creation.component.html',
  styleUrls: ['./game-creation.component.scss'],
  providers: [ConfirmationService]
})
export class GameCreationComponent implements OnInit {

  /** Информация о пользователе */
  user: User;

  /** Идентификатор игры */
  gameId: number;

  /** Текущая игра */
  currentGame: Game;

  /** Сохраненное название игры */
  gameName: string;

  /** Массив уровней игры */
  levels: Level[] = [];

  /** Флаг открытия контейнера с основной информацией об игре */
  isMainInfoBoxOpened: boolean = false;

  /** Флаг начала игры */
  isGameStarted: boolean = false;

  /** Количество уровней для добавления */
  numberOfNewLevels: number;

  /** Форма изменения основной информации */
  formGroupInfo: FormGroup;

  /** Возвращает слово в правильной форме */
  pluralCase = Utils.pluralCase;

  @ViewChild(RefDirective)
  refDir: RefDirective;

  constructor(
    private currentStateService: CurrentStateService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute,
    private gameApiService: GameApiService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    if (!this.currentStateService.isUserLoggedIn)
      this.router.navigate(['']);

    this.activatedRoute.params.subscribe(params => {
      this.gameId = Number(params['game-id']);
      this.formGroupInfo = new FormGroup({
        caption: new FormControl('', []),
        script: new FormControl('', [])
      });
      this.getActualInfo();
    });
    this.isMainInfoBoxOpened = window.innerWidth <= 960;
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.isMainInfoBoxOpened = window.innerWidth <= 960;
  }

  /**
   * Получает актуальную информацию
   */
  getActualInfo(): void {
    this.user = this.currentStateService.currentUser;

    this.gameApiService.getGame(this.gameId).subscribe(response => {
      this.currentGame = response.res;
      this.gameName = this.currentGame.caption;
      this.formGroupInfo.controls.caption.setValue(this.currentGame.caption);
      this.formGroupInfo.controls.script.setValue(this.currentGame.game_yaml);
    })

    this.gameApiService.getLevels(this.gameId).subscribe(response => {
      this.levels = response.res.sort((a, b) => a.inner_id < b.inner_id ? -1 : 1);
    });
  }

  /**
   * Открывает диалоговое окно команд
   */
  showCommandDialog(): void {
    const modalFactory = this.componentFactoryResolver.resolveComponentFactory(CommandInGameDialogComponent);
    this.refDir.viewContainerRef.clear();

    this.currentStateService.isDialogOpened = true;

    const component = this.refDir.viewContainerRef.createComponent(modalFactory);

    component.instance.teams = this.currentGame.teams;
    component.instance.gameId = this.currentGame.id;
    component.instance.isGameStarted = this.isGameStarted;
    component.instance.close.subscribe(() => {
      this.refDir.viewContainerRef.clear();
      this.currentStateService.isDialogOpened = false;
    })
  }

  /**
   * Перейти к редактированию уровня
   * @param levelId идентификатор уровня
   */
  goToLevel(levelId: number): void {
    this.currentStateService.currentLevelId = levelId;
    this.router.navigate(['game', this.gameId, levelId, 'settings']);
  }

  /**
   * Добавляет новые уровни
   */
  addLevels(): void {
    let level: Level = {
      inner_id: '',
      caption: '',
      level_type: 'SIMPLE',
      condition_script: '',
      failed_condition_script: '',
      success_result_values: [],
      failed_result_values: [],
    }

    for (let i = 0; i < this.numberOfNewLevels; i++) {
      level.inner_id = Utils.setInnerId(this.levels, 'inner-id', 3, i);
      level.caption = 'Уровень ' + (this.levels.length + 1 + i);
      this.gameApiService.setLevel(level, this.gameId).subscribe();
    }

    this.numberOfNewLevels = null;

    setTimeout(() => {
      this.getActualInfo();
    }, 1000)
  }

  /**
   * Удаляет уровнеь игры
   * @param levelId идентификатор уровня
   */
  deleteLevel(levelId: number): void {
    this.confirmationService.confirm({
      message: 'Вы уверены, что хотите удалить уровень?',
      header: 'Удаление уровня',
      acceptLabel: 'ДА',
      rejectLabel: 'НЕТ',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'filled accent',
      rejectButtonStyleClass: 'filled',
      accept: () => {
        this.gameApiService.deleteLevel(this.gameId, levelId).subscribe(() => {
          this.getActualInfo();
        })
      },
    });
  }

  /**
   * Сохраняет основную информацию об игре
   */
  saveInfo(): void {
    this.gameApiService.putGame(this.currentGame.id, this.formGroupInfo.controls.caption.value,
      this.formGroupInfo.controls.script.value).subscribe();
  }
}
