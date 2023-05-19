import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Option} from "../../../models/option";
import {GameApiService} from "../../../api/game-api.service";
import {CurrentStateService} from "../../../services/current-state.service";
import {CodeType} from "../../../models/enums/code-type";
import {ResultType} from "../../../models/enums/result-type";
import {Code} from "../../../models/admin-game/code";
import {CodeResult} from "../../../models/admin-game/code-result";
import {Utils} from "../../../shared/utils";
import {ConfirmationService} from "primeng/api";
import {ArrowDivDirective} from "../../../directives/arrow-div.directive";
import {KeyboardService} from "../../../services/keyboard.service";
import {RefDirective} from "../../../directives/ref.directive";
import {forkJoin} from "rxjs";
import {Variables} from "../../../models/user/variables";
import {ToastService} from "../../../services/toast.service";

/**
 * Компонент списка кодов
 */
@Component({
  selector: 'app-list-of-level-codes',
  templateUrl: './list-of-level-codes.component.html',
  styleUrls: ['./list-of-level-codes.component.scss']
})

export class ListOfLevelCodesComponent implements OnInit {

  /** Идентификатор уровня */
  levelId: number;

  /** Идентификатор игры */
  gameId: number;

  /** Массив кодов */
  codes: Code[] = [];

  /** Переменные */
  variables: Variables[];

  /** Возможные коды результатов */
  resultCodes: Option<string>[] = [];

  /** Код нового результата */
  newResultCode: string;

  /** Возможные типы результатов */
  resultTypes: Option<string>[];

  /** Тип нового результата */
  newResultType: string;

  /** Возможные типы кодов */
  codeTypes: Option<string>[] = [
    {name: 'SIMPLE', code: CodeType.SIMPLE},
    {name: 'LOCATION', code: CodeType.LOCATION},
  ];

  /** Ассоциативный массив результатов */
  resultMap = new Map<number, { name: string, element: CodeResult[] }>();

  /** Количество кодов для создания */
  numberOfNewCodes: number;

  /** Выбранный элемент массива */
  chosenItem: Code | CodeResult;

  /** Выбранное поле массива */
  chosenField: string;

  /** Текст ошибки */
  errorText: string;

  @ViewChild(RefDirective)
  refDir: RefDirective

  /** Возвращает слово в правильной форме */
  pluralCase = Utils.pluralCase;

  /** Количество колонок в таблиуе кодов */
  columnsCode: number = 4;

  /** Количество строк в таблице результатов */
  rowsResult: number = 0;

  /** Последний выбранный элемент таблицы */
  savedDiv: ArrowDivDirective;

  /** Массив полей 'таблицы' для передвижения стрелками */
  @ViewChildren(ArrowDivDirective)
  inputs: QueryList<ArrowDivDirective>

  /** Верхняя строка над таблицей */
  @ViewChild('mainInput')
  mainInput: ElementRef

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private confirmationService: ConfirmationService,
    private currentStateService: CurrentStateService,
    private gameApiService: GameApiService,
    private keyboardService: KeyboardService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.levelId = this.currentStateService.currentLevelId;
    this.gameId = this.currentStateService.currentGameId;

    this.getActualInfo();

    if (this.codes) {
      this.chosenItem = this.codes[0];
      this.chosenField = 'code_inner_id';
    }

    this.keyboardService.keyBoard.subscribe(res => {
      !!res.action ? this.onMove(res) : this.onFocus(res);
    })
  }

  /**
   * Получает актуальную информацию
   */
  getActualInfo(): void {
    forkJoin({
      codes: this.gameApiService.getCodes(this.gameId, this.levelId),
      game: this.gameApiService.getGame(this.gameId)
    }).subscribe(({codes, game}) => {
      this.codes = codes.res;
      this.rowsResult = this.codes.length;
      this.setResultsMap();

      if (game.res.variables) {
        this.variables = game.res.variables;
        for (const variable of game.res.variables) {
          if (variable.code != 'DISTANCE')
            this.resultCodes.push({name: variable.code, code: variable.code})
        }
        this.newResultCode = this.resultCodes[0].code;
        this.setResultTypes();
      }
    })
  }

  /**
   * Устанавливает выбранное значение
   * @param item выбранный элемент
   * @param field выбранное поле
   */
  setChosenValue(item?: Code | CodeResult, field?: string): void {
    this.chosenItem = item;
    this.chosenField = field;
  }

  /**
   * Добавляет новые коды
   */
  addCodes(): void {
    for (let i = 0; i < this.numberOfNewCodes; i++) {
      let names = this.resultMap.values();

      let code = {
        id: null,
        code_order: this.codes.length + 1,
        caption: '',
        code_type: 'SIMPLE',
        code_tags: null,
        code_values_info: '',
        code_inner_id: '',
        code_result_values: []
      }

      for (const name of names) {
        let arr = name.name.split('(');
        code.code_result_values.push({
          result_code: arr[0],
          result_type: arr[1].substring(0, arr[1].length - 1),
          result_value: null
        })
      }

      this.codes.push(code);

      let index = 0;
      for (const result of code.code_result_values) {
        this.resultMap.get(index).element.push(result);
        index++;
      }
    }
    this.rowsResult += this.numberOfNewCodes;
    this.numberOfNewCodes = null;
  }

  /**
   * Удаляет код
   * @param code код
   */
  deleteCode(code: Code): void {
    this.confirmationService.confirm({
      message: 'Вы уверены, что хотите удалить код?',
      header: 'Удаление кода',
      acceptLabel: 'ДА',
      rejectLabel: 'НЕТ',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'filled accent',
      rejectButtonStyleClass: 'filled',
      accept: () => {
        this.codes.splice(this.codes.indexOf(code), 1);
        this.rowsResult--;
        this.setResultsMap();
      },
    });
  }

  /**
   * Добавляет результат
   */
  addResult(): void {
    const formattedName = `${this.newResultCode}(${this.newResultType})`;
    let index = this.codes[0].code_result_values ? this.codes[0].code_result_values.length : 0;
    for (let code of this.codes) {
      code.code_result_values.push({
        result_code: this.newResultCode,
        result_type: this.newResultType,
        result_value: null
      })

      if (!this.resultMap.has(index)) {
        this.resultMap.set(index, {name: formattedName, element: []});
      }
      this.resultMap.get(index).element.push(code.code_result_values[code.code_result_values.length - 1]);
    }
  }

  /**
   * Обновляет массив результатов
   */
  setResultsMap(): void {
    this.resultMap = new Map<number, { name: string; element: CodeResult[] }>();

    for (const code of this.codes) {
      let index = 0;
      for (const result of code.code_result_values) {
        const formattedName = `${result.result_code}(${result.result_type})`;
        if (!this.resultMap.has(index)) {
          this.resultMap.set(index, {name: formattedName, element: []});
        }
        this.resultMap.get(index).element.push(result);
        index++;
      }
    }
  }

  /**
   * Удаляет результат
   * @param name название результата
   */
  deleteResult(name: string): void {
    this.confirmationService.confirm({
      message: 'Вы уверены, что хотите удалить результат?',
      header: 'Удаление результата',
      acceptLabel: 'ДА',
      rejectLabel: 'НЕТ',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'filled accent',
      rejectButtonStyleClass: 'filled',
      accept: () => {
        let arr = name.split('(');

        for (const code of this.codes) {
          let res = code.code_result_values.find(element => element.result_code == arr[0] && element.result_type == arr[1].substring(0, arr[1].length - 1));
          code.code_result_values.splice(code.code_result_values.indexOf(res), 1)
        }
        this.setResultsMap();
      },
    });
  }

  /** Сохраняет изменения в таблицах */
  saveChanges(): void {
    this.gameApiService.setCode(this.gameId, this.levelId, this.codes).subscribe(
      response => {
        this.toastService.showSuccessToast('Изменения успешно сохранены');
        this.codes = response.res;
        this.setResultsMap();
      }
    )
  }

  /**
   * Изменяет фокус по нажатию стрелок
   * @param object элемент таблицы
   */
  onMove(object): void {
    const inputToArray = this.inputs.toArray()
    let index = inputToArray.findIndex(x => x.element == object.element);
    const isTransposedTable = object.element.nativeElement.classList[0] == 'transposed'
    if (isTransposedTable) {
      switch (object.action) {
        case "UP":
          index--;
          break;
        case "DOWN":
          index++;
          break;
        case "LEFT":
          index -= this.rowsResult;
          break;
        case "RIGHT":
          index += this.rowsResult;
          break;
      }
    } else {
      switch (object.action) {
        case "UP":
          index -= this.columnsCode;
          break;
        case "DOWN":
          index += this.columnsCode;
          break;
        case "LEFT":
          index--;
          break;
        case "RIGHT":
          index++;
          break;
      }
    }
    if (index >= 0 && index < this.inputs.length) {
      inputToArray[index].element.nativeElement.focus();
      this.savedDiv = inputToArray[index];
    }
  }

  /**
   * Сохраняет последний выбранный элемент таблицы
   * @param object элемент
   */
  onFocus(object): void {
    const inputToArray = this.inputs.toArray()
    let index = inputToArray.findIndex(x => x.element == object.element);
    this.savedDiv = inputToArray[index];
  }

  /**
   * Возвращает фокус на последний выбранный элемент
   */
  returnFocus() {
    if (this.savedDiv) {
      this.savedDiv.element.nativeElement.focus();
    }
  }

  /**
   * Ставит фокус на верхнюю строку над таблицей
   * @param e событие
   */
  onDoubleClick(e: Event): void {
    e.preventDefault();
    this.mainInput.nativeElement.focus();
  }

  /**
   * Устанавливает возможные типы результатов
   */
  setResultTypes(): void {
    if (this.newResultCode == 'INFOS')
      this.resultTypes = [{name: '@', code: ResultType.LINK}];
    else {
      this.resultTypes = [
        {name: 'SIMPLE', code: ResultType.SIMPLE},
        {name: 'BONUS', code: ResultType.BONUS},
      ]
    }
    this.newResultType = this.resultTypes[0].code;
  }
}
