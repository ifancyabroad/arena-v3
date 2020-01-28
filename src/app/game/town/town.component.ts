import { Component, OnInit } from '@angular/core';
import { GameStatus, StateService } from 'src/app/shared/services/state.service';

@Component({
  selector: 'app-town',
  templateUrl: './town.component.html',
  styleUrls: ['./town.component.scss']
})
export class TownComponent implements OnInit {

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  nextFight() {
    this.stateService.moveTo(GameStatus.Arena);
  }

}
