import {Directive, ViewContainerRef} from '@angular/core';

/**
 * Директива для создания нового компонента
 */
@Directive({
  selector: '[appRef]'
})
export class RefDirective {

  constructor(
    public viewContainerRef: ViewContainerRef,
  ) { }
}
