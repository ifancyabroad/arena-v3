import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService } from 'src/app/shared/services/player.service';
import { Player } from 'src/app/shared/classes/player';
import { KeyValue } from '@angular/common';
import { Skill } from 'src/app/shared/interfaces/skill';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() view = 'town';
  @Input() waiting = false;
  player: Player;

  @Output() skillUsed = new EventEmitter<Skill>();

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.player = this.playerService.player;
  }

  // Use a skill when in the arena
  useSkill(skill: Skill) {
    this.skillUsed.emit(skill);
  }

  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

}
