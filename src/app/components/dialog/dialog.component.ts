import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

/**
 * Компонент диалога
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  /** Событие закрытия диалога */
  @Output()
  close = new EventEmitter<void>();

  /** Ширина диалогового окна */
  @Input()
  dialogWidth: number = 440;

  constructor() { }

  ngOnInit(): void {
  }
}
