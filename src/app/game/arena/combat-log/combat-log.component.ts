import { Component, OnInit, Input } from '@angular/core';
import { StateService, GameStatus } from 'src/app/shared/services/state.service';

@Component({
  selector: 'app-combat-log',
  templateUrl: './combat-log.component.html',
  styleUrls: ['./combat-log.component.scss']
})
export class CombatLogComponent implements OnInit {
  @Input() battleOver = false;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  return() {
    this.stateService.moveTo(GameStatus.Town);
  }

}
