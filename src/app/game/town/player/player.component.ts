import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/shared/services/player.service';
import { Player } from 'src/app/shared/classes/player';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  player: Player;

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.player = this.playerService.player;
  }

  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

}
