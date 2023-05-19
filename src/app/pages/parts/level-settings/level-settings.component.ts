import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from "../../../services/local-storage.service";
import {Option} from "../../../models/option";
import {CurrentStateService} from "../../../services/current-state.service";
import {GameApiService} from "../../../api/game-api.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Level} from 'src/app/models/admin-game/level';
import {CodeResult} from "../../../models/admin-game/code-result";
import {Utils} from "../../../shared/utils";
import {RefDirective} from "../../../directives/ref.directive";
import {ToastService} from "../../../services/toast.service";

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

  /** Сообщение об ошибке при сохранении скриптов прохождения и слови */
  errorMessage: string = '';

  /** Сообщение об ошибке при сохранении скрипта условий прохождения */
  acceptationErrorMessage: string = '';

  @ViewChild(RefDirective)
  refDir: RefDirective

  constructor(
    private currentStateService: CurrentStateService,
    private localStorageService: LocalStorageService,
    private gameApiService: GameApiService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.levelId = this.currentStateService.currentLevelId;
    this.gameId = this.currentStateService.currentGameId;

    this.formGroupInfo = new FormGroup({
      id: new FormControl('', []),
      caption: new FormControl('', []),
      codeAcceptation: new FormControl('', []),
      isInner: new FormControl(false, []),
      isGeo: new FormControl(false, []),
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
      this.formGroupInfo.controls.codeAcceptation.setValue(this.currentLevel.code_acceptation_script);
      this.formGroupInfo.controls.isInner.setValue(this.currentLevel.level_type == `INNER`);
      this.formGroupInfo.controls.isGeo.setValue(this.currentLevel.use_location);
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
    const codeResults = isSuccess ? this.currentLevel.success_result_values : this.currentLevel.failed_result_values;
    const idx = this.currentLevel.success_result_values.indexOf(result);
    if (idx !== -1) {
      codeResults.splice(idx, 1);
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
      code_acceptation_script: this.formGroupInfo.controls.codeAcceptation.value,
      success_result_values: this.currentLevel.success_result_values,
      failed_result_values: this.currentLevel.failed_result_values,
      use_location: this.formGroupInfo.controls.isGeo.value,
    }

    this.gameApiService.putLevel(level, this.gameId, this.levelId).subscribe(() => {
      this.toastService.showSuccessToast('Изменения успешно сохранены');
      this.getActualInfo();
    })
  }
}
