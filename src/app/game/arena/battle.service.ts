import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum BattleState {
  Start, Waiting, PlayerTurn, EnemyTurn, Victory, Defeat
}

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  battleState = new BehaviorSubject<BattleState>(BattleState.Start); // Current state of the battle
  turnCounter = 1; // Alternate between 1 and 2

  constructor() { }
}
