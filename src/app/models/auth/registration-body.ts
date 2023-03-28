/**
 * Модель данных,отправляемых при регистрации
 */
export interface RegistrationBody {

  /** Логин пользователя */
  login: string,

  /** Почта */
  email: string,

  /** Пароль */
  password: string,
}
