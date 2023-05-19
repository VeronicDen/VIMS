import {Component, ComponentFactoryResolver, HostListener, OnInit, ViewChild} from '@angular/core';
import {CurrentStateService} from "../../../services/current-state.service";
import {Router} from "@angular/router";
import {User} from "../../../models/auth/user";
import {RefDirective} from "../../../directives/ref.directive";
import {ChangePasswordDialogComponent} from "../../dialogs/change-password-dialog/change-password-dialog.component";

interface GameResult {
  date: string,
  name: string,
  team: string,
  place: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  /** Информация о пользователе */
  user: User;

  /** Массив страниц команд */
  teamsPages: string[][] = [];

  /** Номера страниц команд */
  teamPagesNumbers: number[] = [];

  /** Массив страниц игр */
  gamesPages: string[][] = [];

  /** Номера страниц игр */
  gamePagesNumbers: number[] = [];

  /** Массив страниц результатов */
  resultsPages: GameResult[][] = [];

  /** Номера страниц результатов */
  resultPagesNumbers: number[] = [];

  /** Номера выбранных страниц в слайдере */
  activePages = new Map <string, number>();

  /** Ширина страниц слайдера */
  slidersWidths = new Map <string, number>();

  @ViewChild(RefDirective)
  refDir: RefDirective

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private currentStateService: CurrentStateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.currentStateService.isUserLoggedIn)
      this.router.navigate(['']);

    this.user = this.currentStateService.currentUser;

    this.setSlidersWidth();

    const listOfCommand = ['Julkaqq', 'Team08N', 'Sandboх', 'Index01', 'drea99mm']
    const listOfGames = ['The Fractured but Whole', 'IC#100', 'Нумерология опустошения II: Декаданс',
      'Тренировка DaIGR vol.2', 'THE BOURNE IDENTITY', 'The Fractured but Whole', 'IC#100', 'Нумерология опустошения II: Декаданс',
      'Тренировка DaIGR vol.2', 'THE BOURNE IDENTITY', 'The Fractured but Whole', 'IC#100']
    const listOfResults: GameResult[] = [
      {date: '01.01.22', name: 'Игра 1', team: 'Команда 1', place: '1/10'},
      {date: '21.01.22', name: 'Игра 2', team: 'Команда 2', place: '2/10'},
      {date: '31.01.22', name: 'Игра 3', team: 'Команда 3', place: '3/10'},
      {date: '24.01.22', name: 'Игра 4', team: 'Команда 4', place: '4/10'},
      {date: '25.01.22', name: 'Игра 5', team: 'Команда 5', place: '5/10'},
      {date: '27.12.22', name: 'Игра 6', team: 'Команда 6', place: '6/10'},
      {date: '29.01.22', name: 'Игра 7', team: 'Команда 7', place: '7/10'},
      {date: '01.01.22', name: 'Игра 8', team: 'Команда 8', place: '8/10'},
      {date: '01.01.22', name: 'Игра 9', team: 'Команда 9', place: '9/10'},
      {date: '01.01.22', name: 'Игра 10', team: 'Команда 10', place: '10/10'},
      {date: '01.01.22', name: 'Игра 11', team: 'Команда 11', place: '1/10'},
      {date: '01.01.22', name: 'Игра 12', team: 'Команда 12', place: '2/10'},
      {date: '01.01.22', name: 'Игра 13', team: 'Команда 13', place: '3/10'},
      {date: '01.01.22', name: 'Игра 14', team: 'Команда 14', place: '4/10'},
      {date: '01.01.22', name: 'Игра 15', team: 'Команда 15', place: '5/10'},
      {date: '01.01.22', name: 'Игра 16', team: 'Команда 16', place: '6/10'},
      {date: '01.01.22', name: 'Игра 17', team: 'Команда 17', place: '7/10'},
      {date: '01.01.22', name: 'Игра 18', team: 'Команда 18', place: '8/10'},
      {date: '01.01.22', name: 'Игра 19', team: 'Команда 19', place: '9/10'},
      {date: '01.01.22', name: 'Игра 20', team: 'Команда 20', place: '10/10'},
    ]

    this.teamsPages = this.setListArr(listOfCommand, 10);
    this.teamPagesNumbers = this.setQuantityOfSlides(this.teamsPages.length);
    this.gamesPages = this.setListArr(listOfGames, 10);
    this.gamePagesNumbers = this.setQuantityOfSlides(this.gamesPages.length);
    this.resultsPages = this.setListArr(listOfResults, 7);
    this.resultPagesNumbers = this.setQuantityOfSlides(this.resultsPages.length);

    this.activePages.set('teams', 1);
    this.activePages.set('games', 1);
    this.activePages.set('results', 1);
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.setSlidersWidth();
  }

  /**
   * Устанавливает ширины слайдеров
   */
  setSlidersWidth(): void {
    const innerWidth = window.innerWidth;

    if(innerWidth >= 1280) {
      this.slidersWidths.set('teams', 240);
      this.slidersWidths.set('games', 280);
      this.slidersWidths.set('results', 570);
    }
    else if(innerWidth >= 960) {
      this.slidersWidths.set('teams', 400);
      this.slidersWidths.set('games', 450);
      this.slidersWidths.set('results', 900);
    }
    else if(innerWidth >= 600) {
      this.slidersWidths.set('teams', 240);
      this.slidersWidths.set('games', 280);
      this.slidersWidths.set('results', 580);
    }
    else if(innerWidth >= 500) {
      this.slidersWidths.set('teams', 190);
      this.slidersWidths.set('games', 230);
      this.slidersWidths.set('results', 450);
    }
    else {
      this.slidersWidths.set('teams', innerWidth - 40);
      this.slidersWidths.set('games', innerWidth - 40);
      this.slidersWidths.set('results', innerWidth - 40);
    }
  }

  /**
   * Разделяет массив на подмассивы
   * @param array изначальный массив
   * @param quantity количество элементов в одном подмассиве
   */
  setListArr(array: string[] | GameResult[], quantity: number): any[] {
    let resultArray = [];
    for (let i = 0; i < Math.ceil(array.length/quantity); i++){
      resultArray[i] = array.slice((i*quantity), (i*quantity) + quantity);
    }
    return resultArray;
  }

  /**
   * Передает массив номеров страниц слайдера
   * @param quantity количество
   */
  setQuantityOfSlides(quantity: number): number[] {
    let resultArray = [];
    for (let i = 1; i <= quantity; i++){
      resultArray.push(i);
    }
    return resultArray;
  }

  /**
   * Выход из аккаунта
   */
  logout():void {
    this.currentStateService.clearCurrentState();
  }

  /**
   * Открывает диалоговое окно авторизации
   */
  showChangePasswordDialog(): void {
    const modalFactory = this.componentFactoryResolver.resolveComponentFactory(ChangePasswordDialogComponent);
    this.refDir.viewContainerRef.clear();

    this.currentStateService.isDialogOpened = true;

    const component = this.refDir.viewContainerRef.createComponent(modalFactory);

    component.instance.close.subscribe(() => {
      this.refDir.viewContainerRef.clear();
      this.currentStateService.isDialogOpened = false;
    })
  }
}
