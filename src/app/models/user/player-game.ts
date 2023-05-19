/**
 * Модель данных игры для вывода на главную страницу
 */
export interface PlayerGame {

  /** Состояние игры */
  game_state: string,

  /** Название игры */
  caption: string;

  /** Автор */
  authors: {
    /** Логин автора */
    login: string,

    /** Роль автора */
    role: string,

    /** Идентификатор пользователя */
    user_id: number
  }[];

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
  teams: {

    /** Идентификатор команды */
    id: number,

    /** Название команды */
    caption: string,

    /** Состояние команды в игре */
    accepted: number,
  }[];
}
