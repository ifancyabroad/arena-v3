import { Component, OnInit } from '@angular/core';
import { StateService, GameStatus } from '../shared/services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  toCharacterCreate() {
    this.stateService.moveTo(GameStatus.CharacterCreate);
  }

}
