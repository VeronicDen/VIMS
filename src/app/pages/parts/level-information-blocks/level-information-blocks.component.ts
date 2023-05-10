import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {Option} from "../../../models/option";
import {GameApiService} from "../../../api/game-api.service";
import {CurrentStateService} from "../../../services/current-state.service";
import {Infos} from "../../../models/admin-game/infos";
import {ConfirmationService} from "primeng/api";
import {RefDirective} from "../../../directives/ref.directive";
import {Utils} from "../../../shared/utils";

/**
 * Компонент информации об уровне
 */
@Component({
  selector: 'app-level-information-blocks',
  templateUrl: './level-information-blocks.component.html',
  styleUrls: ['./level-information-blocks.component.scss'],
  providers: [ConfirmationService]
})
export class LevelInformationBlocksComponent implements OnInit {

  /** Идентификатор уровня */
  levelId: number;

  /** Идентификатор игры */
  gameId: number;

  /** Список типов блоков для выпадающего меню */
  blockTypes: Option<string>[] = [
    {name: 'Обычный', code: 'SIMPLE'},
    {name: 'Ссылка на уровень', code: 'LEVEL'}
  ];

  /** Список уровней для выпадающего меню */
  levelsForLinks: Option<number>[] = [];

  /** Массив блоков информации */
  blocks: { info: Infos, isHTML: boolean }[] = [];

  /** Флаг ошибки при сохранении нескольких блоков */
  isSaveErrorInFor: boolean = false;

  /** Вызывает оповещение */
  showToast = Utils.showToast;

  @ViewChild(RefDirective)
  refDir: RefDirective

  constructor(
    private currentStateService: CurrentStateService,
    private gameApiService: GameApiService,
    private confirmationService: ConfirmationService,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit(): void {
    this.levelId = this.currentStateService.currentLevelId;
    this.gameId = this.currentStateService.currentGameId;

    this.gameApiService.getLevels(this.gameId).subscribe(response => {
      for (const level of response.res) {
        if (this.levelId != +level.id)
          this.levelsForLinks.push({name: level.caption, code: level.id})
      }
    });

    this.getActualInfo();
  }

  /**
   * Получает актуальную информацию
   */
  getActualInfo(): void {
    this.gameApiService.getInfoBlocks(this.gameId, this.levelId).subscribe(response => {
      this.blocks = [];
      for (const info of response.res.sort((a, b) => +a.inner_id > +b.inner_id ? 1 : -1)) {
        this.blocks.push({
          info: info,
          isHTML: false
        })
      }
    });
  }

  /**
   * Добавляет новый блок информации
   */
  addNewBlock(): void {
    const infoBlock: Infos = {
      inner_id: "",
      info_caption: "",
      info_text: "",
      info_type: "SIMPLE",
      condition_script: "",
      linked_level_id: ""
    }

    this.gameApiService.setInfoBlock(this.gameId, this.levelId, infoBlock).subscribe(() => {
      this.getActualInfo();
    });
  }

  /**
   * Сохраняет изменения в блоке информации
   * @param block измененный блок информации
   * @param isInFor вызывается ли функция из цикла
   */
  saveChangedBlock(block: Infos, isInFor: boolean): void {
    const infoBlock: Infos = {
      inner_id: block.inner_id,
      info_caption: block.info_caption,
      info_text: block.info_text,
      info_type: block.info_type,
      condition_script: block.condition_script,
      linked_level_id: block.linked_level_id,
    }

    this.gameApiService.putInfoBlock(this.gameId, this.levelId, block.id, infoBlock).subscribe(() => {
      if (!isInFor)
        this.showToast(false, this.componentFactoryResolver, this.refDir);
    }, () => {
      if (isInFor)
        this.isSaveErrorInFor = true;
      else
        this.showToast(true, this.componentFactoryResolver, this.refDir);
    });
  }

  /**
   * Сохраняет все блоки
   */
  saveAllChanges(): void {
    for (const block of this.blocks) {
      this.saveChangedBlock(block.info, true);
    }

    setTimeout(() => {
      if (this.isSaveErrorInFor) {
        this.showToast(true, this.componentFactoryResolver, this.refDir);
        this.isSaveErrorInFor = false;
      }
      else {
        this.showToast(false, this.componentFactoryResolver, this.refDir);
        this.getActualInfo();
      }
    }, 1000)
  }

  /**
   * Удаляет блок информации
   * @param infoId идентификатор блока информации
   */
  deleteBlock(infoId: number): void {
    this.confirmationService.confirm({
      message: 'Вы уверены, что хотите удалить блок информации?',
      header: 'Удаление блока',
      acceptLabel: 'ДА',
      rejectLabel: 'НЕТ',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'filled accent',
      rejectButtonStyleClass: 'filled',
      accept: () => {
        this.gameApiService.deleteInfoBlock(this.gameId, this.levelId, infoId).subscribe(() => {
          this.getActualInfo();
        })
      },
    });
  }
}
