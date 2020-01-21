import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum GameStatus {
  Home, CharacterCreate, InPlay
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _state = new BehaviorSubject<GameStatus>(GameStatus.Home);

  constructor() { }

  get state() {
    return this._state.asObservable();
  }

  moveTo(state: GameStatus) {
    this._state.next(state);
  }
}
