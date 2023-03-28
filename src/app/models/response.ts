/**
 * Модель данных результата запроса
 */
export interface Response<T> {

  /** Результат */
  res: T,

  /** Ошибка */
  error: string,

  /** Комментарий */
  comments: string,
}
