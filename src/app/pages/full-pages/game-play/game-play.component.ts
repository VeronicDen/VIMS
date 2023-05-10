import {Component, OnInit} from '@angular/core';
import {Option} from "../../../models/option";
import {ActionApiService} from "../../../api/action-api.service";
import {LocalStorageService} from "../../../services/local-storage.service";
import {Router} from "@angular/router";
import {TeamLevel} from "../../../models/user/team-level";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {CodeForSend} from "../../../models/user/code-for-send";
import {GameApiService} from "../../../api/game-api.service";
import {KeyValue} from "@angular/common";
import {Variables} from "../../../models/user/variables";
import {Utils} from "../../../shared/utils";
import {ActionGame} from "../../../models/user/action-game";

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnInit {

  /** Название игры */
  gameName: string = '';

  /** Массив уровней игры */
  levels: TeamLevel[] = [];

  /** Список уровней для выпадающего меню */
  levelsOption: Option<TeamLevel>[] = [];

  /** Список дочерних уровней для выпадающего меню */
  childLevelsOption: Option<TeamLevel>[] = [];

  /** Выбранный уровень */
  actualLevel: TeamLevel;

  /** Выбранный дочерний уровень*/
  actualChildLevel: TeamLevel;

  /** Код */
  code: string = '';

  /** Идентификатор выбранного уровня */
  codeLevelId: number;

  /** Сообщение при ошибке в отправке кода */
  errorMessage: string = '';

  /** Результаты уровня */
  scores: Map<string, any> = new Map<string, any>();

  /** Разница времени для результата ВРЕМЯ */
  timeDifInScores: number = 0;

  /** Услоия прохождения */
  passCondition: string = '';

  /** Условия слива */
  failedCondition: string = '';

  /** Условия принятия кода */
  codeAcceptationScript: string = '';

  /** Текст задания */
  task: SafeHtml = '';

  /** Массив значений для таблицы кодов */
  codesInfo: { count: string; info: string }[] = [];

  /** Флаг необходимости геолокации при отправки ответа */
  isGeoRequired: boolean = false;

  /** Переменные */
  variables: Variables[] = [];

  /** Возвращает число строкой с незначащими нулями */
  setNumberWithZeroAsString = Utils.setNumberWithZeroAsString;

  constructor(
    private actionApiService: ActionApiService,
    private gameApiService: GameApiService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private sanitized: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    if (!this.localStorageService.game_token) {
      this.router.navigate(['']);
      return;
    }
    this.actionApiService.enterTheGame(this.localStorageService.game_token).subscribe(response => {
      this.gameName = response.res.game.caption;
      if (response.res.game.variables)
        this.variables = response.res.game.variables;

      setInterval(() => {
        this.timeDifInScores++;
      }, 1000)

      this.getActualInfo(response.res);
    })
  }

  /**
   * Получает актуальную информацию
   * @param game Вся информация об игре
   */
  getActualInfo(game: ActionGame): void {
    this.levels = game.team_levels;
    this.levelsOption = [];
    for (const level of this.levels) {
      this.levelsOption.push({name: level.level.level_info.caption, code: level})
    }

    //Если уровень не выбран или выбран, но такого больше нет
    if (!this.actualLevel && !game.team_levels.find(a => a.level.id == this.actualLevel?.level.id))
      this.actualLevel = this.levels[0];

    this.setActualLevel();
  }

  /**
   * Устанавливает текущий уровень
   */
  setActualLevel() {
    this.childLevelsOption = [];

    if (this.actualLevel.child_levels.length == 0) {
      this.setActualData(this.actualLevel);
      return;
    }

    for (const level of this.actualLevel.child_levels) {
      this.childLevelsOption.push({name: level.level.level_info.caption, code: level})
    }

    if (!this.actualChildLevel && !this.actualLevel.child_levels.find(a => a.level.id == this.actualChildLevel?.level.id))
      this.actualChildLevel = this.actualLevel.child_levels[0];

    this.setActualData(this.actualChildLevel);
  }

  /**
   * Устанавливает данные для вывода
   * @param level уровень
   */
  setActualData(level: TeamLevel) {
    let string = '';
    for (const info of level.level.team_infos) {
      string += info.status == 'showed' ? info.info.info_caption + info.info.info_text : '';

      string += info.status == 'planned' ?
        info.info.info_caption + "<p>Условия выдачи:</p>" + info.info.condition_script : '';
    }
    if (string == '') {
      string = "<p>Условия выдачи пока не известны</p>";
    }

    this.scores = new Map<string, any>();
    for (const entry of Object.entries(level.level.level_scores)) {
      this.scores.set(entry[0], entry[1]);
    }

    this.task = this.sanitized.bypassSecurityTrustHtml(string);

    this.passCondition = level.level.level_info.condition_script;
    this.failedCondition = level.level.level_info.failed_condition_script;
    this.codeAcceptationScript = level.level.level_info.code_acceptation_script;
    this.isGeoRequired = !!this.codeAcceptationScript?.includes('DISTANCE');
    this.codeLevelId = level.level.id;

    this.codesInfo = [];
    let count = 1;
    for (const codes of level.level.level_codes) {
      for (const code of codes.code_result_values) {
        let first = count + ': ' + (codes.code_values_info ? codes.code_values_info : '');
        count++;

        let second = 'бонус: ';

        if (this.variables.length > 0) {
          second = this.variables.find(a => a.code == code.result_code).caption + ': ' + '_' + ', ';
          switch (code.result_type) {
            case 'SIMPLE':
              second += 'время: ';
              break;
            case ('BONUS'):
              second += 'бонус: ';
              break;
            case ('@'):
              second += 'откроет: ';
              break;
          }
        }
        second += '_';

        this.codesInfo.push({count: first, info: second})
      }
    }
  }

  /**
   * Отпрапвляет код
   */
  sendCode() {
    if (this.code != '')
      return;

    let code: CodeForSend = {
      code_value: this.code,
      team_level_id: this.codeLevelId,
    }

    let isError: boolean = false;
    if (this.isGeoRequired) {
      navigator.geolocation.getCurrentPosition(position => {
        /*if (position.coords.accuracy >= 30) {
          this.codeError = 'слишком большая погрешность';
        }
        else {*/
        code.current_location = {
          lon: position.coords.longitude, lat: position.coords.latitude
        };
        /*}*/
      }, () => {
        isError = true;
        if (GeolocationPositionError.PERMISSION_DENIED) {
          this.errorMessage = 'вы запретили трекинг своей геопозиции';
        } else {
          this.errorMessage = 'получить местоположение не удалось';
        }
      })
      setTimeout(() => {
        this.errorMessage = '';
      }, 4000)
    }

    if (isError)
      return;

    setTimeout(() => {
      this.actionApiService.sendCode(this.localStorageService.game_token, code).subscribe(response => {
        this.getActualInfo(response.res.team_info);
      }, error => {
        this.code = '';
        if (error.error.error == "wrong-code") {
          this.errorMessage = error.error.comments;
        } else if (error.error.error == "can-not-accept") {
          this.errorMessage = 'вы находитесь далеко от места'
        } else {
          this.errorMessage = 'неопределенная ошибка'
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000)
      })
    }, 1500)

    this.code = '';
  }

  /**
   * Обрабатывает результаты
   * @param element необработанные результаты
   */
  setScore(element: KeyValue<string, any>): string {
    if (element.key == 'TIME') {
      return 'Время: ' + Math.floor((+element.value + this.timeDifInScores) / 3600) + ':' +
        this.setNumberWithZeroAsString(Math.floor((+element.value + this.timeDifInScores) / 60) -
        Math.floor((+element.value + this.timeDifInScores) / 3600) * 60, 2) + ':' +
        this.setNumberWithZeroAsString((+element.value + this.timeDifInScores) % 60, 2);
    }
    return 'Баллы: ' + element.value;
  }
}
