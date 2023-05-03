/**
 * Модель данных игры
 */
import {Team} from "./team";
import {Variables} from "../user/variables";

export interface Game {

  /** Идентификатор игры */
  id: number,

  /** Имя игры */
  caption: string,

  /** Дата создания */
  creation_date: Date;

  /** Состояние игры */
  game_state: string;

  /** Тип игры */
  game_type: string;

  /** Основной скрипт игры */
  game_yaml: string;

  /** Комманды зарегистрированные в игре */
  teams: Team[];

  /** Переменные игры */
  variables?: Variables[];
}
