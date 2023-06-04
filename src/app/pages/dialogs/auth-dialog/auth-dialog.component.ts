import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocalStorageService} from "../../../services/local-storage.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthApiService} from "../../../api/auth-api.service";
import {RegistrationBody} from "../../../models/auth/registration-body";
import {CurrentStateService} from "../../../services/current-state.service";
import {LoginBody} from "../../../models/auth/login-body";
import jwt_decode from "jwt-decode";

/**
 * Диалог авторизации
 */
@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {

  /** Флаг открытия окна регистрации */
  @Input()
  isRegistration: boolean;

  /** Флаг вызова из хедера */
  @Input()
  isFromHeader: boolean = false;

  /** Событие закрытия диалога */
  @Output()
  close = new EventEmitter<void>();

  /** Форма авторизации */
  formGroupLogin: FormGroup = new FormGroup({
    login: new FormControl('',
      [Validators.required]),
    password: new FormControl('',
      [Validators.required]),
  });

  /** Форма регистрации */
  formGroupRegistration: FormGroup = new FormGroup({
    login: new FormControl('',
      [Validators.required]),
    mail: new FormControl('',
      [Validators.required, Validators.email]),
    password: new FormControl('',
      [Validators.required]),
  });

  /** Текст сообщения об ошибке */
  errorMessageText: any;

  constructor(
    private authApiService: AuthApiService,
    private currentStateService: CurrentStateService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {

  }

  /**
   * Проверяет, темная я ли тема
   */
  isThemeDark(): boolean {
    return this.localStorageService.theme == 'DARK';
  }

  /**
   * Авторизует пользователя
   */
  loginUser(): void {
    this.formGroupLogin.markAsTouched();
    if (this.formGroupLogin.invalid) {
      this.errorMessageText = 'Все поля должны быть заполнены';
      return;
    }
    this.errorMessageText = '';

    const user: LoginBody = {
      login: this.formGroupLogin.controls.login.value,
      password: this.formGroupLogin.controls.password.value
    }

    this.authApiService.authUser(user).subscribe((response) => {
      this.localStorageService.token = response.res.access_token;
      this.localStorageService.refresh_token = response.res.refresh_token;

      this.currentStateService.isUserLoggedIn = true;
      this.currentStateService.currentUser = jwt_decode(this.localStorageService.token);

      this.close.emit();
    },() => {
      this.formGroupLogin.markAsUntouched();
      this.errorMessageText = 'ошибка';
    })
  }

  /**
   * Регистрирует пользователя
   */
  registerUser(): void {
    this.formGroupRegistration.markAsTouched();
    if (this.formGroupRegistration.invalid) {
      if (this.formGroupRegistration.controls.login.valid &&
        this.formGroupRegistration.controls.password.valid && this.formGroupRegistration.controls.mail.invalid)
      {
        this.errorMessageText = 'Введите корректный e-mail';
        return;
      }
      this.errorMessageText = 'Все поля должны быть заполнены';
      return;
    }
    this.errorMessageText = '';

    const user: RegistrationBody = {
      login: this.formGroupRegistration.controls.login.value,
      email: this.formGroupRegistration.controls.mail.value,
      password: this.formGroupRegistration.controls.password.value
    }

    this.authApiService.registerUser(user).subscribe(() => {
      this.changeForm(true);
    },() => {
      this.formGroupRegistration.markAsUntouched();
      this.errorMessageText = 'Ошибка';
    })
  }

  /**
   * Переключает форму
   * @param isToRegistration флаг открытия окна регистрации
   */
  changeForm(isToRegistration: boolean): void {
    this.isRegistration = !isToRegistration;
    this.errorMessageText = '';
  }
}
