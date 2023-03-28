/**
 * Модель данных,отправляемых при входе в систему
 */
export interface LoginBody {

  /** Логин */
  login: string,

  /** Пароль */
  password: string,
}
