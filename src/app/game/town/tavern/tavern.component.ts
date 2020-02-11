import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/shared/classes/player';
import { PlayerService } from 'src/app/shared/services/player.service';

@Component({
  selector: 'app-tavern',
  templateUrl: './tavern.component.html',
  styleUrls: ['./tavern.component.scss']
})
export class TavernComponent implements OnInit {
  player: Player;

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.player = this.playerService.player;
  }

  rest() {
    this.player.addGold(-60);
    this.player.heal(15);
    this.player.resetSkills();
  }

}
