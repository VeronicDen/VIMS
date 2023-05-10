/**
 * Модель данных уровня в запущенной игре
 */
import {ActionLevel} from "./action-level";

export interface TeamLevel {

  /** Дочерние уровни */
  child_levels: TeamLevel[],

  /** Скрипт для дочерних уровней */
  child_levels_script: {
    id: string,
    order: number,
  }[],

  /** Информация об уровне */
  level: ActionLevel,
}
