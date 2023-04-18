import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Team} from "../../../models/admin-game/team";
import {GameApiService} from "../../../api/game-api.service";
import {adjustElementAccessExports} from "@angular/compiler-cli/ngcc/src/packages/adjust_cjs_umd_exports";

/**
 * Диалог изменения команд в игре
 */
@Component({
  selector: 'app-command-in-admin-game-dialog',
  templateUrl: './teams-in-game-dialog.component.html',
  styleUrls: ['./teams-in-game-dialog.component.scss']
})
export class CommandInGameDialogComponent implements OnInit {

  /** Массив команд */
  @Input()
  teams: Team[];

  /** Идентификатор игры */
  @Input()
  gameId: number;

  /** Флаг начала игры */
  @Input()
  isGameStarted: boolean;

  /** Событие закрытия диалога */
  @Output()
  close = new EventEmitter<void>();

  /** Массив принятых команд */
  acceptedTeams: Team[];

  /** Массив непринятых команд */
  rejectedTeams: Team[];

  constructor(
    private gameApiService: GameApiService,
  ) { }

  ngOnInit(): void {
    this.divideTeams();
  }

  /**
   * Разделение команд на принятые и нет
   */
  divideTeams():void {
    this.acceptedTeams = [];
    this.rejectedTeams = [];

    for (const team of this.teams) {
      if (team.accepted == 1)
        this.acceptedTeams.push(team);
      else
        this.rejectedTeams.push(team);
    }
  }

  /**
   * Изменение состояния команды
   * @param teamId идентификатор команды
   * @param isAccepted флаг принятия команды
   */
  moveTeam(teamId: number, isAccepted: boolean): void {
    if (!this.isGameStarted) {
      if (isAccepted) {
        let el = this.acceptedTeams.splice(this.acceptedTeams.findIndex(a => a.id == teamId), 1);
        this.rejectedTeams.push(el[0]);
        this.gameApiService.rejectTeam(this.gameId, teamId).subscribe();
      } else {
        let el = this.rejectedTeams.splice(this.rejectedTeams.findIndex(a => a.id == teamId), 1);
        this.acceptedTeams.push(el[0]);
        this.gameApiService.acceptTeam(this.gameId, teamId).subscribe();
      }
    }
  }
}
