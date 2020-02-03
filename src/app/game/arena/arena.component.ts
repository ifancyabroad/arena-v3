import { Component, OnInit, OnDestroy } from '@angular/core';
import { Skill } from 'src/app/shared/interfaces/skill';
import { Enemy } from 'src/app/shared/classes/enemy';
import { EnemiesService } from 'src/app/shared/services/enemies.service';
import { PlayerService } from 'src/app/shared/services/player.service';
import { Player } from 'src/app/shared/classes/player';
import { Battle, BattleState } from './battle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss']
})
export class ArenaComponent implements OnInit, OnDestroy {
  battle: Battle;
  player: Player;
  enemy: Enemy;

  logSubscription: Subscription;
  stateSubscription: Subscription;
  log: string[] = [];
  waiting = false;
  battleOver = false;

  constructor(
    private playerService: PlayerService,
    private enemiesService: EnemiesService
  ) { }

  ngOnInit() {
    this.player = this.playerService.player;
    this.enemy = this.enemiesService.createEnemy(2);

    this.battle = new Battle(this.player, this.enemy);
    this.logSubscription = this.battle.combatLog.subscribe(event => this.log.unshift(event));
    this.stateSubscription = this.battle.state$.subscribe(state => {
      this.waiting = state === BattleState.Waiting ? true : false;
      this.battleOver = state === BattleState.Victory ? true : false;
    });
  }

  roundStart(playerSkill: Skill) {
    this.battle.startRound(playerSkill);
  }

  ngOnDestroy() {
    this.logSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }
}
