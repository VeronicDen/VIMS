import {Infos} from "../admin-game/infos";

/**
 * Модель данных блока информации в игре
 */
export interface TeamInfo {

  /** Идентификатор */
  id: number,

  /** Основная информация блока информации */
  info: Infos,

  /** Идентификатор блока информации */
  info_id: number,

  /** Дата */
  insert_date: string,

  /** Статус */
  status: string,

  /** Идентификатор коамнды в игре */
  team_level_id: number
}
