import {Level} from "../admin-game/level";
import {TeamInfo} from "./team-info";
import {Code} from "../admin-game/code";

/**
 * Модель данных с информацией об уровне запущенной игры
 */
export interface ActionLevel {

  /** Дата и время окончания */
  date_end: string,

  /** Дата и время начала */
  date_start: string,

  /**  */
  done: number,

  /** Идентификатор игры команды */
  game_team_id: number,

  /** Идентификатор */
  id: number,

  /** Коды уровня */
  level_codes: Code[],

  /** Идентификатор уровня */
  level_id: number,

  /** Уровень */
  level_info: Level,

  /** Статус */
  status: string,

  /** Коды команды */
  team_codes: any[],

  /** Блоки информации команды */
  team_infos: TeamInfo[]
}
