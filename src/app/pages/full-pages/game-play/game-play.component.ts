import { Component, OnInit } from '@angular/core';
import {Level} from "../../../models/admin-game/level";
import {Option} from "../../../models/option";

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnInit {

  /** Название выбранной игры */
  gameName: string;

  /** Массив уровней игры */
  levels: Level[] = [];

  actualLevel: Level;

  levelsOption: Option<string>[] = [];

  code: string = '';

  constructor() { }

  ngOnInit(): void {
    this.gameName = 'Игра 1';
    this.levels = [];

    this.actualLevel = this.levels[0];

    for (const level of this.levels) {
      this.levelsOption.push({
        name: '(' + (level.id+1) + '/' + this.levels.length + ')', code: String(level.id)
      })
    }
  }


  setActualLevel(event: any) {
    this.actualLevel = this.levels[event.value]
  }
}
