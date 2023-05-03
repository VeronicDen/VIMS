export interface CodeForSend {
  code_value: string,
  team_level_id: number,
  code_value_type?: string,
  current_location?: {
    lat: string,
    lon: string
  }
}
