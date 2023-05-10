import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ProfileComponent} from "./profile.component";
import {ComponentFactoryResolver} from "@angular/core";
import {CurrentStateService} from "../../../services/current-state.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../../services/local-storage.service";
import {By} from "@angular/platform-browser";

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        ComponentFactoryResolver,
        CurrentStateService,
        Router],
      imports: [
        LocalStorageService,
      ]
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  })

  it('  should be created', () => {
    expect(component).toBeDefined();
  })

  it('  should bind user name', () => {
    component.user = {
      login: 'user',
      email: 'user@gmail.com'
    };
    fixture.detectChanges();
    let el: HTMLElement = fixture.debugElement.query(By.css('user-name')).nativeElement;

    expect(el.textContent).toContain(component.user.login);
  })
})
