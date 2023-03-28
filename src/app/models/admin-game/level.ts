/**
 * Модель данных уровня
 */
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

  /** Скрипт слива */
  failed_condition_script: string,
}
