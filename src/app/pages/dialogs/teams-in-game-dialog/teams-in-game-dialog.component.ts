import {Component, EventEmitter, OnInit, Output} from '@angular/core';

/**
 * Диалог изменения команд в игре
 */
@Component({
  selector: 'app-command-in-admin-game-dialog',
  templateUrl: './teams-in-game-dialog.component.html',
  styleUrls: ['./teams-in-game-dialog.component.scss']
})
export class CommandInGameDialogComponent implements OnInit {

  /** Событие закрытия диалога */
  @Output()
  close = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  /** Изменение состояния команды */
  moveCommand(command: string, isAccepted): void {

  }
}
