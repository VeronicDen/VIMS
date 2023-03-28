import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Компонент слайдера
 */
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  /** Максимальный номер страниц */
  @Input()
  maxNumberOfSlides: number;

  /** Номер активной страницы */
  @Input()
  activeSlideNumber: number;

  /** Событие смены выбраной страницы слайдера*/
  @Output()
  activeSlideNumberChange = new EventEmitter<number>()

  /** Масив номеров страниц */
  arrayOfSlideNumbers: number[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let i = 1; i <= this.maxNumberOfSlides; i++)
      this.arrayOfSlideNumbers.push(i);
  }

  /**
   * Активная ли кнопка
   * @param isForwardButton является ли кнопка переключателем ВПЕРЕД
   */
  isButtonActive(isForwardButton: boolean): boolean {
    if (isForwardButton)
      return this.activeSlideNumber < this.maxNumberOfSlides;
    else
      return this.activeSlideNumber > 1;
  }

  /**
   * Переключает слайдер
   * @param isForwardButton является ли кнопка переключателем ВПЕРЕД
   */
  flipSlider(isForwardButton: boolean): number {
    if (this.isButtonActive(isForwardButton))
      this.activeSlideNumber = isForwardButton ? this.activeSlideNumber + 1 : this.activeSlideNumber - 1;
    this.activeSlideNumberChange.emit(this.activeSlideNumber);
    return this.activeSlideNumber;
  }
}
