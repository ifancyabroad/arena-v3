import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from '../../classes/player';
import { Enemy } from '../../classes/enemy';
import { StateService, GameStatus } from '../../services/state.service';
import { ScoresService, Score } from '../../services/scores.service';
import { switchMap } from 'rxjs/operators';
import { User, LoginService } from '../../services/login.service';
import { Subscription } from 'rxjs';
import { Config, RankTier } from '../../config';
import { ModalService } from '../../services/modal.service';

interface DialogData {
  player: Player;
  enemy: Enemy;
}

@Component({
  selector: 'app-game-over-modal',
  templateUrl: './game-over-modal.component.html',
  styleUrls: ['./game-over-modal.component.scss']
})
export class GameOverModalComponent implements OnInit, OnDestroy {
  user: User;
  userSubscription: Subscription;

  scoreSubmitted = false;
  highScores: Score[];

  constructor(
    public dialogRef: MatDialogRef<GameOverModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private stateService: StateService,
    private scoresService: ScoresService,
    private loginService: LoginService,
    private config: Config,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.userSubscription = this.loginService.user.subscribe(currentUser => this.user = currentUser);
  }

  submitScore() {
    this.scoreSubmitted = true;
    this.scoresService.postScore(this.data.player, this.data.enemy.name)
      .pipe(
        switchMap(result => this.scoresService.getScores())
      ).subscribe(result => {
        this.highScores = result;
      }, error => {
        console.log(error);
        this.modalService.errorDialog(
          'Failed to submit score', 
          error
        );
        this.scoreSubmitted = false;
      });
  }

  restart() {
    this.dialogRef.close();
    this.stateService.moveTo(GameStatus.Home);
  }

  getRank(kills: number): RankTier {
    return this.config.rankTier.filter(rank => kills >= rank.kills).shift();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
