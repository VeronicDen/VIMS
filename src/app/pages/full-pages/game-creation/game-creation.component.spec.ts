




import {GameCreationComponent} from "./game-creation.component";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ComponentFactoryResolver} from "@angular/core";
import {ConfirmationService} from "primeng/api";
import {CurrentStateService} from "../../../services/current-state.service";
import {GameApiService} from "../../../api/game-api.service";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {Subject} from "rxjs";
import {LocalStorageService} from "../../../services/local-storage.service";

class RouterStub {
  navigate(path: string[]) {
  }
}

class ActivatedRoutStub {
  private subject = new Subject<Params>();

  push(params: Params) {
    this.subject.next(params);
  }

  get params() {
    return this.subject.asObservable();
  }
}

describe('GameCreationComponent', () => {
  let component: GameCreationComponent;
  let fixture: ComponentFixture<GameCreationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameCreationComponent],
      providers: [
        ComponentFactoryResolver,
        ConfirmationService,
        CurrentStateService,
        GameApiService,
        {provide: ActivatedRoute, useClass: ActivatedRoutStub},
        {provide: Router, useClass: RouterStub},
      ],
      imports: [
        LocalStorageService,
      ]
    })

    fixture = TestBed.createComponent(GameCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it ('should be created', () => {
    expect(component).toBeDefined();
  })

  it ('game name should be bound', () => {
    const name = 'trulyalya'
    component.gameName = name;
    fixture.detectChanges();
    let el: HTMLElement = fixture.debugElement.query(By.css('game-name')).nativeElement;

    expect(el.textContent).toContain(name);
  })













































































































})
