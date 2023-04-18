/**
 * Модель данных уровня в запущенной игре
 */
import {ActionLevel} from "./action-level";

export interface TeamLevel {


  child_levels: TeamLevel[],

  child_levels_script: {
    id: string,
    order: number,
  }[],

  level: ActionLevel,
}
