import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "../../services/local-storage.service";

/**
 * Компонент футера
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Проверяет, темная ли тема выбрана
   */
  isThemeDark(): boolean {
    return this.localStorageService.theme == 'DARK';
  }
}
