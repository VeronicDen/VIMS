/**
 * Модель данных команды в игре
 */
export interface Team {

  /** Идентификатор команды */
  id: number,

  /** Имя команды */
  caption: string,

  /** Статус в игре */
  accepted: number;
}
