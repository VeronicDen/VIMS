/**
 * Модель данных уровня
 */
import {CodeResult} from "./code-result";
import {Infos} from "./infos";
import {Code} from "./code";

export interface Level {

  /** Идентификатор уровня */
  id?: number,

  /** Внутренний идентификатор уровня */
  inner_id: string,

  /** Название игры */
  caption: string,

  /** Тип уровня (SIMPLE или INNER) */
  level_type: string,

  /** Скрипт прохождения */
  condition_script: string,

  /** Результаты прохождения */
  success_result_values: CodeResult[],

  /** Скрипт провала */
  failed_condition_script: string,

  /** Результаты провала */
  failed_result_values: CodeResult[],

  /** */
  deleted?: any,

  /** Блоки информации */
  infos?: Infos[],

  /** Коды */
  codes?: Code[],
}
