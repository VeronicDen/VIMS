/**
 * Модель данных запущенной игры
 */
import {TeamLevel} from "./team-level";
import {Game} from "../admin-game/game";

export interface ActionGame {


  accepted: number,

  game_id: number,

  id: number,

  level_script: string,

  team_id: number,

  game: Game,

  team_levels: TeamLevel[],

  total_scores: any,
}
