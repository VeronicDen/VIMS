/**
 * Модель данных команды
 */
export interface Team {

  /** Идентификатор команды */
  id?: number,

  /** Имя команды */
  caption: string,

  /** Дата создания команды */
  creation_date: Date,
}
