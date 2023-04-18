/**
 * Модель данных запущенной игры
 */
import {TeamLevel} from "./team-level";

export interface ActionGame {


  accepted: number,

  game_id: number,

  id: number,

  level_script: string,

  team_id: number,

  team_levels: TeamLevel,

  total_scores: {
    TIME: number,
  }
}
