import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[innerIdText]'
})
export class IdDirective {

  constructor(
    private _el: ElementRef
  ) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this._el.nativeElement.value = initalValue.replace(/[^a-z0-9а-я]*/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
