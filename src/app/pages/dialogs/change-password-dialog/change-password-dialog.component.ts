import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LocalStorageService} from "../../../services/local-storage.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { FormValidators } from 'src/app/shared/form-validators';

/**
 * Диалог смены пароля
 */
@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  /** Событие закрытия диалога */
  @Output()
  close = new EventEmitter<void>();

  /** Форма смены пароля */
  formGroupChangePassword: FormGroup;

  /** Текст сообщения об ошибке */
  errorMessageText: any;

  constructor(
    private localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit(): void {
    this.formGroupChangePassword = new FormGroup({
        oldPassword: new FormControl('',
          [Validators.required]),
        newPassword: new FormControl('',
          [Validators.required]),
        confirmPassword: new FormControl('',
          [Validators.required]),
      },
      FormValidators.mustMatch('newPassword', 'confirmPassword')
    );
  }

  /**
   * Проверяет, темная я ли тема
   */
  isThemeDark(): boolean {
    return this.localStorageService.theme == 'DARK';
  }

  /**
   * Изменяет пароль
   */
  changePassword(): void {
    this.formGroupChangePassword.markAsTouched();
    this.errorMessageText = '';
    if (this.formGroupChangePassword.invalid) {
      if (this.formGroupChangePassword.controls.oldPassword.value == '' ||
        this.formGroupChangePassword.controls.newPassword.value == '' ||
        this.formGroupChangePassword.controls.confirmPassword.value == '') {
        this.errorMessageText = 'Все поля должны быть заполнены';
        return;
      }
      if (this.formGroupChangePassword.controls.newPassword.value != this.formGroupChangePassword.controls.confirmPassword.value) {
        this.errorMessageText = 'Пароли должны совпадать';
        return;
      }
    }
  }
}
