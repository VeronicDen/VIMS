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

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnInit {

  gameName: string = '';

  /** Массив уровней игры */
  levels: TeamLevel[] = [];

  levelsOption: Option<TeamLevel>[] = [];

  childLevelsOption: Option<TeamLevel>[] = [];

  actualLevel: TeamLevel;

  actualChildLevel: TeamLevel;

  code: string = '';

  codeLevelId: number;

  codeError: string = '';

  time: string = '';

  scores: Map<string, any> = new Map<string, any>();

  timeDifInScores: number = 0;

  passCondition: string = '';

  failedConditionScript: string = '';

  codeAcceptationScript: string = '';

  task: SafeHtml = '';

  codesInfo: { count: string; info: string }[] = [];

  variables: Variables[] = [];

  options = {
    enableHighAccuracy: true,
    timeout: 3600
  }

  setNumberWithZeroAsString = Utils.setNumberWithZeroAsString;

  constructor(
    private localStorageService: LocalStorageService,
    private actionApiService: ActionApiService,
    private gameApiService: GameApiService,
    private router: Router,
    private sanitized: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    if (this.localStorageService.game_token) {

      navigator.geolocation.getCurrentPosition(position => {
        console.log(position)
        console.log(position.coords.accuracy)
      }, error => {
        const { code } = error

        switch (code) {
          case GeolocationPositionError.TIMEOUT:
            // время получения геолокации истекло
            console.log('время получения геолокации истекло')
            break
          case GeolocationPositionError.PERMISSION_DENIED:
            // пользователь запретил трекинг своей геопозиции
            console.log('пользователь запретил трекинг своей геопозиции')
            break
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            // получить местоположение не удалось
            console.log('получить местоположение не удалось')
            break
        }
      },{
        enableHighAccuracy: true
      })
      //navigator.geolocation.watchPosition(this.getCurrentPosition, this.errorInGetCurrentPosition, this.options)

      this.actionApiService.enterTheGame(this.localStorageService.game_token).subscribe(response => {
        this.gameName = response.res.game.caption;
        this.variables = response.res.game.variables;

        setInterval(() => {
          this.timeDifInScores++;
        }, 1000)

        this.levels = response.res.team_levels;
        for (const level of this.levels) {
          this.levelsOption.push({name: level.level.level_info.caption, code: level})
        }
        this.actualLevel = this.levels[0];
        this.setActualLevel();
      })
    } else {
      this.router.navigate(['']);
    }
  }

  setActualLevel() {
    this.childLevelsOption = [];

    if (this.actualLevel.child_levels.length > 0) {
      for (const level of this.actualLevel.child_levels) {
        this.childLevelsOption.push({name: level.level.level_info.caption, code: level})
      }
      this.actualChildLevel = this.actualLevel.child_levels[0];
      this.setActualTask(this.actualChildLevel);
    } else {
      this.setActualTask(this.actualLevel);
    }
  }

  setActualTask(level: TeamLevel) {
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
    this.failedConditionScript = level.level.level_info.failed_condition_script;
    this.codeAcceptationScript = level.level.level_info.code_acceptation_script;
    this.codeLevelId = level.level.id;

    this.codesInfo = [];
    let count = 1;
    for (const codes of level.level.level_codes) {
      for (const code of codes.code_result_values) {
        let first = count + ': ' + (codes.code_values_info ? codes.code_values_info : '');
        count++;

        let second = this.variables.find(a => a.code == code.result_code).caption + ': ' + '_' + ', ';
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
        second += '_';

        this.codesInfo.push({count: first, info: second})
      }
    }
  }

  setCode() {
    if (this.code != '') {
      let code: CodeForSend = {
        code_value: this.code,
        team_level_id: this.codeLevelId,
      }

      this.actionApiService.sendCode(this.localStorageService.game_token, code).subscribe(response => {

      }, error => {
        this.code = '';
        if (error.error.error == "wrong-code") {
          this.codeError = error.error.comments;
          setTimeout(() => {
            this.codeError = '';
          }, 3000)
        }
      })

    }
  }

  getScore(element: KeyValue<string, any>): string {
    if (element.key == 'TIME') {
      return 'Время: ' + Math.floor((+element.value + this.timeDifInScores) / 3600) + ':' +
        this.setNumberWithZeroAsString(Math.floor((+element.value + this.timeDifInScores) / 60) -
        Math.floor((+element.value + this.timeDifInScores) / 3600) * 60, 2) + ':' +
        this.setNumberWithZeroAsString((+element.value + this.timeDifInScores) % 60, 2);
    }
    return 'Баллы: ' + element.value;
  }
}
