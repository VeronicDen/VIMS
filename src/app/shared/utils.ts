import {ToastComponent} from "../components/toast/toast.component";
import {ComponentFactoryResolver} from "@angular/core";
import {RefDirective} from "../directives/ref.directive";

export class Utils {

  /**
   * Возвращает число строкой с незначащими нулями
   * @param number число
   * @param digitsNumbers количество незначащих нулей
   */
  static setNumberWithZeroAsString(number: number, digitsNumbers: number): string {
    let result = '';
    for (let i = 0; i < digitsNumbers - String(number).length; i++) {
      result += '0';
    }
    result += number;
    return result;
  }

  /**
   * Возвращает идентификатор элемента массива
   * @param arr массив
   * @param fieldName имя поля
   * @param digitsNumbers количество незначащих нулей
   * @param extraLength дополнительное число
   */
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


  /**
   * Показывает оповещение о результате сохранения
   * @param isError флаг ошибки сохранения
   * @param componentFactoryResolver
   * @param refDir
   */
  static showToast(isError: boolean, componentFactoryResolver: ComponentFactoryResolver, refDir: RefDirective): void {
    const modalFactory = componentFactoryResolver.resolveComponentFactory(ToastComponent);
    refDir.viewContainerRef.clear();

    const component = refDir.viewContainerRef.createComponent(modalFactory);
    component.instance.isError = isError;
    component.instance.close.subscribe(() => {
      refDir.viewContainerRef.clear();
    })
  }
}
