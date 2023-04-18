import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TeamApiService} from "../../../api/team-api.service";

/**
 * Диалог создания новой команды
 */
@Component({
  selector: 'app-new-team-dialog',
  templateUrl: './new-team-dialog.component.html',
  styleUrls: ['./new-team-dialog.component.scss']
})
export class NewTeamDialogComponent implements OnInit {

  /** Событие закрытия диалога */
  @Output()
  close = new EventEmitter<void>();

  /** Текст сообщения об ошибке */
  errorMessageText: string = '';

  /** Название команды */
  teamName: string = '';

  constructor(
    private teamApiService: TeamApiService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Создает новую команду
   */
  createNewTeam(): void {
    if (this.teamName.trim() == '') {
      this.errorMessageText = 'Введите название команды';
      return;
    }

    this.teamApiService.setTeam(this.teamName).subscribe(() => {
      this.close.emit();
    });
  }
}
