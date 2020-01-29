import { Component, OnInit } from '@angular/core';
import { Skill } from 'src/app/shared/interfaces/skill';
import { Enemy } from 'src/app/shared/classes/enemy';
import { EnemiesService } from 'src/app/shared/services/enemies.service';
import { BattleService, BattleState } from './battle.service';
import { PlayerService } from 'src/app/shared/services/player.service';
import { Player } from 'src/app/shared/classes/player';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss']
})
export class ArenaComponent implements OnInit {
  player: Player;
  enemy: Enemy;

  constructor(
    private playerService: PlayerService,
    private enemiesService: EnemiesService,
    private battleService: BattleService
  ) { }

  ngOnInit() {
    this.player = this.playerService.player;
    this.enemy = this.enemiesService.createEnemy(2)
    console.log(this.enemy);
  }

  // Check turn order and begin the round
  roundStart(playerSkill: Skill) {
    if (this.player.stats.initiative.total >= this.enemy.stats.initiative.total) {
      this.battleService.battleState.next(BattleState.PlayerTurn);
    } else {
      this.battleService.battleState.next(BattleState.EnemyTurn);
    }
  }

}
