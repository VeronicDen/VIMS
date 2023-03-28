/**
 * Модель данных игры
 */
export interface Game {

  /** Идентификатор игры */
  id: number,

  /** Имя игры */
  caption: string,

  /** Дата создания */
  creation_date: Date;

  /** Состояние игры */
  game_state: string;

  /**  */
  game_type: string;

  /** Основной скрипт игры */
  game_yaml: string;
}
