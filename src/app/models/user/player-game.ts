/**
 * Модель данных игры для вывода на главную страницу
 */
export interface PlayerGame {

  /** Состояние игры */
  game_state: string,

  /** Название игры */
  caption: string;

  /** Автор */
  author?: string;

  /** Время и дата начала игры */
  beginningOfGame?: string;

  /** Время и дата конца игры */
  endOfGame?: string;

  /** Описание */
  description?: string;

  /** Время и дата создания */
  creation_date: string;

  /** Идентификатор */
  id: number;

  /** Команды в игре */
  teams: any[];
}
