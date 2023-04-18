import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../../../services/local-storage.service";
import {Option} from "../../../models/option";
import {CurrentStateService} from "../../../services/current-state.service";
import {GameApiService} from "../../../api/game-api.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Level} from 'src/app/models/admin-game/level';
import {CodeResult} from "../../../models/admin-game/code-result";

/**
 * Компонент настроек уровня
 */
@Component({
  selector: 'app-level-settings',
  templateUrl: './level-settings.component.html',
  styleUrls: ['./level-settings.component.scss']
})
export class LevelSettingsComponent implements OnInit {

  /** Список видов результатов для выпадающего меню */
  resultTypes: Option<string>[] = [
    {name: 'ШТРАФ', code: 'fine'},
    {name: 'БОНУС', code: 'bonus'},
    {name: 'ПРОСТО', code: 'simply'},
    {name: '@', code: 'empty'},
  ];

  /** Идентификатор игры */
  gameId: number;

  /** Идентификатор уровня */
  levelId: number;

  /** Текущая игра */
  currentLevel: Level;

  /** Форма изменения основной информации */
  formGroupInfo: FormGroup;

  /** Результаты прохождения */
  passResults: CodeResult[];

  /** Скрипт прохождения */
  passScript: string;

  /** Результаты слива */
  failedResults: CodeResult[];

  /** Скрипт слива */
  failedScript: string;

  /** Сообщение об ошибке при сохранении скриптов */
  errorMessage: string = '';

  constructor(
    private currentStateService: CurrentStateService,
    private localStorageService: LocalStorageService,
    private gameApiService: GameApiService,
  ) {
  }

  ngOnInit(): void {
    this.levelId = this.currentStateService.currentLevelId;
    this.gameId = this.currentStateService.currentGameId;

    this.formGroupInfo = new FormGroup({
      id: new FormControl('', []),
      caption: new FormControl('', []),
      isInner: new FormControl(true, [])
    });

    this.getActualInfo();
  }

  /**
   * Получает актуальную информацию
   */
  getActualInfo(): void {
    this.gameApiService.getLevel(this.gameId, this.levelId).subscribe(response => {
      this.currentLevel = response.res;
      this.formGroupInfo.controls.caption.setValue(this.currentLevel.caption);
      this.formGroupInfo.controls.id.setValue(this.currentLevel.inner_id);
      this.formGroupInfo.controls.isInner.setValue(this.currentLevel.level_type != `INNER`);
    })
  }

  /**
   * Проверяет, светлая ли тема
   */
  isThemeLight(): boolean {
    return this.localStorageService.theme != 'DARK';
  }

  /**
   * Добавляет результат прохождения
   */
  addSuccessResult(): void {
    if (!this.currentLevel.success_result_values)
      this.currentLevel.success_result_values = [];
    this.currentLevel.success_result_values.push({result_code: '', result_type: 'fine', result_value: ''});
  }

  /**
   * Добавляет результат слива
   */
  addFailedResult(): void {
    if (!this.currentLevel.failed_result_values)
      this.currentLevel.failed_result_values = [];
    this.currentLevel.failed_result_values.push({result_code: '', result_type: 'fine', result_value: ''});
  }

  /**
   * Удаляет результат
   * @param isSuccess флаг результата прохождения
   * @param result результат
   */
  deleteResult(isSuccess: boolean, result: CodeResult): void {
    if (isSuccess) {
      this.currentLevel.success_result_values.splice(this.currentLevel.success_result_values.findIndex(
        a => a.result_type == result.result_type && a.result_code == result.result_code
        && a.result_value == result.result_value), 1)
    } else {
      this.currentLevel.failed_result_values.splice(this.currentLevel.failed_result_values.findIndex(
        a => a.result_type == result.result_type && a.result_code == result.result_code
          && a.result_value == result.result_value), 1)
    }
  }

  /**
   * Сохраняет новую информацию об уровне
   */
  saveChanges(): void {
    const level: Level = {
      inner_id: this.formGroupInfo.controls.id.value,
      caption: this.formGroupInfo.controls.caption.value,
      level_type: this.formGroupInfo.controls.isInner.value ? 'INNER' : 'SIMPLE',
      condition_script: this.currentLevel.condition_script,
      failed_condition_script: this.currentLevel.failed_condition_script,
      success_result_values: this.currentLevel.success_result_values,
      failed_result_values: this.currentLevel.failed_result_values
    }

    this.gameApiService.putLevel(level, this.gameId, this.levelId).subscribe(response => {
      this.getActualInfo();
    }, error => {
      this.errorMessage = error.error.comments;
      setTimeout(() => {
        this.errorMessage = '';
      }, 4000)
    })
  }
}
