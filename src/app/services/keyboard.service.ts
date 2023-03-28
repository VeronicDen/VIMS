import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  keyBoard:Subject<any>=new Subject<any>();

  sendMessage(message:any) {
    this.keyBoard.next(message)
  }
}
