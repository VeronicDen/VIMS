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
    this.levels = [{
      id: 0, inner_id: '001', caption: 'Уровень 1', level_type: '123', condition_script: '98765432', failed_condition_script: '98765432'
    },{
      id: 1, inner_id: '002', caption: 'Уровень 2', level_type: '123', condition_script: '9876543', failed_condition_script: '9876543'
    },{
      id: 2, inner_id: '003', caption: 'Уровень 3', level_type: '123', condition_script: '987654', failed_condition_script: '987654'
    },{
      id: 3, inner_id: '004', caption: 'Уровень 4', level_type: '123', condition_script: '98765', failed_condition_script: '98765'
    }];

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
