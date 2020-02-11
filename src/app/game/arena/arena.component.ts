import { Component, OnInit, OnDestroy } from '@angular/core';
import { Skill } from 'src/app/shared/interfaces/skill';
import { Enemy } from 'src/app/shared/classes/enemy';
import { EnemiesService } from 'src/app/shared/services/enemies.service';
import { PlayerService } from 'src/app/shared/services/player.service';
import { Player } from 'src/app/shared/classes/player';
import { Battle, BattleState } from './battle';
import { Subscription } from 'rxjs';
import { GameOverModalComponent } from 'src/app/shared/components/game-over-modal/game-over-modal.component';
import { MatDialog } from '@angular/material/dialog';

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
    private enemiesService: EnemiesService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.player = this.playerService.player;
    this.enemy = this.enemiesService.createEnemy(2);

    this.battle = new Battle(this.player, this.enemy);
    this.logSubscription = this.battle.combatLog.subscribe(event => this.log.unshift(event));
    this.stateSubscription = this.battle.state$.subscribe(state => {
      this.waiting = state === BattleState.Waiting ? true : false;
      this.battleOver = state === BattleState.Victory ? true : false;

      if (state === BattleState.Defeat) {
        this.gameOver();
      }
    });
  }

  roundStart(playerSkill: Skill) {
    this.battle.startRound(playerSkill);
  }

  gameOver() {
    const dialogRef = this.dialog.open(GameOverModalComponent, {
      disableClose: true,
      width: '500px',
      data: {
        player: this.player,
        enemy: this.enemy
      }
    });
  }

  ngOnDestroy() {
    this.logSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }
}
