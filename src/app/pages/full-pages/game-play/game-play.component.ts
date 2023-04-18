import { Component, OnInit } from '@angular/core';
import {Option} from "../../../models/option";
import {ActionApiService} from "../../../api/action-api.service";
import {LocalStorageService} from "../../../services/local-storage.service";
import {Router} from "@angular/router";
import {TeamLevel} from "../../../models/user/team-level";
import {CodeResult} from "../../../models/admin-game/code-result";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnInit {

  /** Массив уровней игры */
  levels: TeamLevel[] = [];

  levelsOption: Option<TeamLevel>[] = [];

  childLevelsOption: Option<TeamLevel>[] = [];

  actualLevel: TeamLevel;

  actualChildLevel: TeamLevel;

  code: string = '';

  time: string = '';

  passCondition: string = '';

  failedConditionScript: string = '';

  task: SafeHtml = '';

  codes: CodeResult[] = [];

  //testMarkup: SafeHtml;

  constructor(
    private localStorageService: LocalStorageService,
    private actionApiService: ActionApiService,
    private router: Router,
    private sanitized: DomSanitizer,
  ) { }

  ngOnInit(): void {
    if (this.localStorageService.game_token) {
      this.actionApiService.enterTheGame(this.localStorageService.game_token).subscribe(response => {
        this.levels = response.res.team_levels;
        for (const level of this.levels) {
          this.levelsOption.push({ name: level.level.level_info.caption, code: level})
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
    this.passCondition = this.actualLevel.level.level_info.condition_script;
    this.failedConditionScript = this.actualLevel.level.level_info.failed_condition_script;

    if (this.actualLevel.child_levels.length > 0) {
      for (const level of this.actualLevel.child_levels) {
        this.childLevelsOption.push({ name: level.level.level_info.caption, code: level})
      }
      this.actualChildLevel = this.actualLevel.child_levels[0];
      this.setActualTask(this.actualChildLevel);
    } else {
      this.setActualTask(this.actualLevel);
    }
  }

  setActualTask(level: TeamLevel){
    let string = '';
    for (const info of level.level.team_infos) {
      string += info.status == 'showed' ? info.info.info_text : '';
    }
    if (string == '') {
      for (const info of level.level.team_infos) {
        string += info.status == 'planned' ? "<p>Условия выдачи:</p>" + info.info.condition_script : '';
      }
      if (string == '') {
        string = "<p>Условия выдачи пока не известны</p>";
      }
    }

    this.task = this.sanitized.bypassSecurityTrustHtml(string);

    this.codes = [];
    for (const codes of level.level.level_codes) {
      for (const code of codes.code_result_values) {
        this.codes.push(code);
      }
    }
  }
}
