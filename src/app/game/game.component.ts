import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StateService, GameStatus } from '../shared/services/state.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private stateSub: Subscription;
  gameState: GameStatus;

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.stateSub = this.stateService.state.subscribe(state => this.gameState = state);
  }

}
