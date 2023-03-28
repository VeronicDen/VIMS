/**
 * Модель данных пользователя
 */
export interface User {

  /** Идентификатор пользователя */
  id?: number,

  /** Логин пользователя */
  login: string,

  /** Почта */
  email: string,

  /** Дата получения токена */
  token_date?: Date
}
