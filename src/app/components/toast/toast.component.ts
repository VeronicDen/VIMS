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

  @Input()
  isError: boolean = false;

  text: string;

  constructor() { }

  ngOnInit(): void {
    this.text = this.isError ? 'Ошибка при сохранении' : 'Изменения успешно сохранены';
    setTimeout(() => {
      this.close.emit();
    }, 2000)
  }

}
