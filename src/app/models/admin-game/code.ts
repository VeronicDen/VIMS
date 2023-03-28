/**
 * Модель данных кодов
 */
import {CodeResult} from "./code-result";

export interface Code {

  /** Идентификатор кода */
  id: number,

  /**  */
  code_order: number,

  /** Название */
  caption: string,

  /**  */
  code_type: string,

  /**  */
  code_tags: string,

  /**  */
  code_values_info: string,

  /**  */
  code_inner_id: string,

  /** Результаты кода */
  code_result_values: CodeResult[]
}
