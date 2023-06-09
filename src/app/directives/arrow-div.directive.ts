import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import {KeyboardService} from '../services/keyboard.service'

@Directive({
  selector: '[arrow-div]'
})
export class ArrowDivDirective {

  constructor(
    private keyboardService: KeyboardService,
    public element: ElementRef,
    private render: Renderer2
  ) {
    this.render.setAttribute(this.element.nativeElement, "tabindex", "0")
  }

  @HostListener('keydown', ['$event']) onKeyUp(e) {
    switch (e.keyCode) {
      case 38:
        this.keyboardService.sendMessage({ element: this.element, action: 'UP'});
        e.preventDefault();
        break;
      case 37:
        this.keyboardService.sendMessage({ element: this.element, action: 'LEFT'});
        e.preventDefault();
        break;
      case 40:
        this.keyboardService.sendMessage({ element: this.element, action: 'DOWN'});
        e.preventDefault();
        break;
      case 39:
        this.keyboardService.sendMessage({ element: this.element, action: 'RIGHT'});
        e.preventDefault();
        break;
    }
  }

  @HostListener('focusin', ['event']) onFocus() {
    this.keyboardService.sendMessage({element: this.element})
  }
}
