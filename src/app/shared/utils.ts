export class Utils {

  static setNumberWithZeroAsString(number: number, digitsNumbers: number): string {
    let result = '';
    for (let i = 0; i < digitsNumbers - String(number).length; i++) {
      result += '0';
    }
    result += number;
    return result;
  }

  static setInnerId(arr: any[], fieldName: string, digitsNumbers: number, extraLength: number): string {
    let result = '';
    let isNew = false;
    let count = 1;

    while (!isNew) {
      result = this.setNumberWithZeroAsString(arr.length + count + extraLength, digitsNumbers);
      arr.find(el => el[fieldName] == result) ? count++ : isNew = true;
    }

    return result;
  }

  /**
   * Возвращает слово в правильной форме
   * @param number число
   * @param stringCases массив возможных форм слова
   */
  static pluralCase(number: number, stringCases: { one: string, few: string, other: string }) {
    const cases = [2, 0, 1, 1, 1, 2];
    return [
      stringCases.one,
      stringCases.few,
      stringCases.other
    ][(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  }
}
