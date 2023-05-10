import {Component, ComponentFactoryResolver, HostListener, OnInit, ViewChild} from '@angular/core';
import {CurrentStateService} from "../../../services/current-state.service";
import {Router} from "@angular/router";
import {User} from "../../../models/auth/user";
import {GameApiService} from "../../../api/game-api.service";
import {Game} from "../../../models/admin-game/game";
import {RefDirective} from "../../../directives/ref.directive";
import {SliderComponent} from "../../../components/slider/slider.component";

@Component({
  selector: 'app-users-games',
  templateUrl: './users-games.component.html',
  styleUrls: ['./users-games.component.scss']
})
export class UsersGamesComponent implements OnInit {

  /** Информация о пользователе */
  user: User;

  /** Открытый слайд */
  activeSlide: number = 1;

  /** Название новой игры */
  gameName: string = '';

  /** Массив всех игр пользователя */
  games: Game[] = [];

  /** Массив страниц игр */
  gamesPages: Game[][] = [];

  /** Ширина страниц слайдера таблицы игр */
  slidersTableWidth: number;

  @ViewChild(RefDirective)
  refDir: RefDirective

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private currentStateService: CurrentStateService,
    private gameApiService: GameApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.currentStateService.isUserLoggedIn)
      this.router.navigate(['']);

    this.setSlidersTableWidth();
    this.getActualInfo();
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.setSlidersTableWidth();
  }

  /**
   * Получает актуальную информацию
   */
  getActualInfo(): void {
    this.user = this.currentStateService.currentUser;
    this.gameApiService.getGames().subscribe(response => {
      this.games = response.res;

      for(let i = 0; i < Math.ceil((this.games.length) / 8); i++) {
        let arr = []
        for (let j = i * 8; j < i * 8 + 8; j++) {
          if (this.games[j])
            arr.push(this.games[j])
        }
        this.gamesPages.push(arr);
      }
      this.showSlider();
    })
  }

  /**
   * Устанавливает ширину слайдов таблицы игр
   */
  setSlidersTableWidth(): void {
    const innerWidth = window.innerWidth;

    if(innerWidth >= 1280)
      this.slidersTableWidth = 570;
    else if(innerWidth >= 960)
      this.slidersTableWidth = 500;
    else if(innerWidth >= 600)
      this.slidersTableWidth = 580;
    else if(innerWidth >= 500)
      this.slidersTableWidth = 450;
    else
      this.slidersTableWidth = innerWidth - 40;
  }

  /**
   * Создает новую игру
   */
  createNewGame(): void {
    if (this.gameName == '')
      return;

    this.gameApiService.setGame(this.gameName).subscribe(response => {
      this.goToGame(response.res);
    });
    this.gameName = '';
  }

  /**
   * Перейти к редактированию игры
   * @param gameId идентификатор игры
   */
  goToGame(gameId): void {
    this.router.navigate(['game', gameId]);
  }

  /**
   * Отображает слайдер
   */
  showSlider(): void {
    const modalFactory = this.componentFactoryResolver.resolveComponentFactory(SliderComponent);
    this.refDir.viewContainerRef.clear();

    const component = this.refDir.viewContainerRef.createComponent(modalFactory);

    component.instance.maxNumberOfSlides = this.gamesPages.length;
    component.instance.activeSlideNumber = this.activeSlide;
    component.instance.activeSlideNumberChange.subscribe(() => {
      this.activeSlide = component.instance.activeSlideNumber;
    })
  }
}
