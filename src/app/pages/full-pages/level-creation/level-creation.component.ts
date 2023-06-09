import {Component, OnInit} from '@angular/core';
import {CurrentStateService} from "../../../services/current-state.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GameApiService} from "../../../api/game-api.service";
import {Game} from "../../../models/admin-game/game";
import {Level} from "../../../models/admin-game/level";
import {ConfirmationService} from "primeng/api";
import {forkJoin} from "rxjs";

/**
 * Компонент редактирования уровня
 */
@Component({
  selector: 'app-level-creation',
  templateUrl: './level-creation.component.html',
  styleUrls: ['./level-creation.component.scss']
})
export class LevelCreationComponent implements OnInit {

  /** Текущий уровень */
  level: Level;

  /** Текущая игра */
  game: Game;

  constructor(
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private currentStateService: CurrentStateService,
    private gameApiService: GameApiService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    if (!this.currentStateService.isUserLoggedIn)
      this.router.navigate(['']);

    this.activatedRoute.params.subscribe(params => {
      this.currentStateService.currentLevelId = params['level-id'];
      this.currentStateService.currentGameId = params['game-id'];

      forkJoin({
        game: this.gameApiService.getGame(params['game-id']),
        level: this.gameApiService.getLevel(params['game-id'], params['level-id'])
      }).subscribe(({game, level}) => {
        this.game = game.res;
        this.level = level.res;
      })
    })
  }

  /**
   * Проверка ссылки на неактивность
   * @param item название раздела
   */
  isInactiveLink(item: string): boolean {
    let urlArr = this.router.url.split('/');
    return urlArr[urlArr.length - 1] != item;
  }

  /**
   * Переход в другой раздел меню
   * @param item название раздела
   */
  menuClick(item: string): void {
    this.router.navigate(['game', this.game.id, this.level.id, item]);
  }

  /**
   * Переход на страницу редактирования игры
   */
  backToLevel(): void {
    this.router.navigate(['game', this.game.id]);
  }
}
