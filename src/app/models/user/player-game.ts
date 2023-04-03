/**
 * Модель данных игры для вывода на главную страницу
 */
export interface PlayerGame {
  game_state: string,
  caption: string;
  author?: string;
  beginningOfGame?: string;
  endOfGame?: string;
  description?: string;
  creation_date: string;
  id: number;
  teams: any[];
}
