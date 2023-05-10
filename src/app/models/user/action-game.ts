import {TeamLevel} from "./team-level";
import {Game} from "../admin-game/game";

/**
 * Модель данных запущенной игры
 */
export interface ActionGame {

  /** */
  accepted: number,

  /** Идентификатор игры */
  game_id: number,

  /** Идентификатор */
  id: number,

  /** Скрипт последовательности уровней в игре? */
  level_script: string,

  /** Идентификатор команды в игре */
  team_id: number,

  /** Основная информация об игре */
  game: Game,

  /** Уровни игры */
  team_levels: TeamLevel[],

  /** Итоговые результаты */
  total_scores: any,
}
