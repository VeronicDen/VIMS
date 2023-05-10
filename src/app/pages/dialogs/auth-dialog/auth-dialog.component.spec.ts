///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>


import {AuthDialogComponent} from "./auth-dialog.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {AuthApiService} from "../../../api/auth-api.service";
import {CurrentStateService} from "../../../services/current-state.service";
import {LocalStorageService} from "../../../services/local-storage.service";
import {HttpClient} from "@angular/common/http";

/*describe('AuthDialogComponent', () => {
  let component: AuthDialogComponent;
  let fixture: ComponentFixture<AuthDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthDialogComponent],
      providers: [
        AuthApiService,
        CurrentStateService,
        LocalStorageService,
        AuthDialogComponent,
      ],
      imports: [
        HttpClient,
      ]
    });
    TestBed.createComponent(AuthDialogComponent);
    fixture = TestBed.createComponent(AuthDialogComponent);
    component = fixture.componentInstance;
  })

  it('should', () => {
    expect(component).toBeDefined();
  })

  it('should', () => {
    expect(component.isThemeDark())
  })
})*/
