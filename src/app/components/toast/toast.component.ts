import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  /** Событие закрытия окна */
  @Output()
  close = new EventEmitter<void>();

  /** Флаг ошибки */
  @Input()
  isError: boolean;

  /** Текст сообщения */
  @Input()
  text: string;

  constructor() { }

  ngOnInit(): void {
    this.text = this.isError ? this.text : 'Изменения успешно сохранены';



    /*if (!this.isError) {
      setTimeout(() => {
        this.close.emit();
      }, 2000)
    }*/
  }

}
