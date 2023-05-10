/**
 * Модель данных кода для отправки
 */
export interface CodeForSend {

  /** Значение кода */
  code_value: string,

  /** Идентификатор команды в игре */
  team_level_id: number,

  /** Тип значения кода */
  code_value_type?: string,

  /** Текущая позиция */
  current_location?: {
    lat: number,
    lon: number
  }
}
