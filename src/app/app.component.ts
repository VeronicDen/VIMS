import { Component } from '@angular/core';
import {CurrentStateService} from "./services/current-state.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './shared/theme-colors/_theme.scss', './shared/theme-colors/_colors.scss']
})
export class AppComponent {
  title = 'VIMS';

  constructor(
    public currentStateService: CurrentStateService,
  ) {}
}
