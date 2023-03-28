export interface Infos {

  /** Идентификатор блока */
  id?: number;

  /** Внутренний идентификатор блока */
  inner_id:	string;

  /** Название блока */
  info_caption: string;

  /** html содержащий непосредственно информацию */
  info_text?: string;

  /** Тип уровня (SIMPLE или LEVEL) */
  info_type: string;

  /** Условие появление */
  condition_script?: string;

  /** Ссылка на уровень */
  level_link?: string;
}
