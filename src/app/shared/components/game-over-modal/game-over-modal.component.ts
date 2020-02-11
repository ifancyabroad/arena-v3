import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from '../../classes/player';
import { Enemy } from '../../classes/enemy';
import { StateService, GameStatus } from '../../services/state.service';

interface DialogData {
  player: Player;
  enemy: Enemy;
}

@Component({
  selector: 'app-game-over-modal',
  templateUrl: './game-over-modal.component.html',
  styleUrls: ['./game-over-modal.component.scss']
})
export class GameOverModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GameOverModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private stateService: StateService
  ) { }

  ngOnInit() {
  }

  restart() {
    this.dialogRef.close();
    this.stateService.moveTo(GameStatus.Home);
  }

}
