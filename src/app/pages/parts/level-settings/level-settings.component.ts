import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../../../services/local-storage.service";
import {Option} from "../../../models/option";
import {Game} from "../../../models/admin-game/game";
import {CurrentStateService} from "../../../services/current-state.service";
import {GameApiService} from "../../../modules/api/game-api.service";
import {FormControl, FormGroup} from "@angular/forms";
import { Level } from 'src/app/models/admin-game/level';

interface LevelResult {
  code: string,
  typeCode: string,
  value: string,
}

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
  passResults: LevelResult[];

  /** Скрипт прохождения */
  passScript: string;

  /** Результаты слива */
  drainResults: LevelResult[];

  /** Скрипт слива */
  drainScript: string;

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

    this.passResults = [
      {code: '001', typeCode: 'bonus', value: '150'},
      {code: '002', typeCode: 'bonus', value: '300'},
      {code: '003', typeCode: 'simply', value: '50'},
    ];

    this.drainResults = [
      {code: '001', typeCode: 'fine', value: '150'},
      {code: '002', typeCode: 'fine', value: '300'},
      {code: '003', typeCode: 'fine', value: '50'},
      {code: '004', typeCode: 'empty', value: '100'},
    ];

    this.getActualInfo();
  }

  /**
   * Получает актуальную информацию
   */
  getActualInfo(): void {
    this.gameApiService.getLevel(this.gameId, this.levelId).subscribe(response => {
      this.currentLevel= response.res;
      this.formGroupInfo.controls.caption.setValue(this.currentLevel.caption);
      this.formGroupInfo.controls.id.setValue(this.currentLevel.inner_id);
      this.formGroupInfo.controls.isInner.setValue(this.currentLevel.level_type != `INNER`)
    })
  }

  /**
   * Проверяет, светлая ли тема
   */
  isThemeLight(): boolean {
    return this.localStorageService.theme != 'DARK';
  }

  /**
   * Сохраняет изменения результатов
   */
  saveResultsChanges(): void {

  }

  /**
   * Добавляет результат прохождения
   */
  addPassResult(): void {
    this.passResults.push({code: '', typeCode: 'fine', value: ''});
  }

  /**
   * Добавляет результат слива
   */
  addDrainResult(): void {
    this.drainResults.push({code: '', typeCode: 'fine', value: ''});
  }

  /**
   * Сохраняет основную информацию об уровне
   */
  saveChanges(): void {
    const level: Level = {
      inner_id: this.formGroupInfo.controls.id.value,
      caption: this.formGroupInfo.controls.caption.value,
      level_type: this.formGroupInfo.controls.isInner.value ? 'INNER' : 'SIMPLE',
      condition_script: this.currentLevel.condition_script,
      failed_condition_script: this.currentLevel.failed_condition_script
    }

    this.gameApiService.putLevel(level, this.gameId, this.levelId).subscribe(response => {
      this.getActualInfo();
    })
  }
}
