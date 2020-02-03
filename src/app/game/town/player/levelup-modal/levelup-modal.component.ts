import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from 'src/app/shared/classes/player';
import { Stats } from 'src/app/shared/interfaces/class';
import Utils from '../../../../shared/utils';
import { KeyValue } from '@angular/common';

interface DialogData {
  player: Player;
}

@Component({
  selector: 'app-levelup-modal',
  templateUrl: './levelup-modal.component.html',
  styleUrls: ['./levelup-modal.component.scss']
})
export class LevelupModalComponent implements OnInit {
  tempPoints: number;
  tempStats: Stats;

  constructor(
    public dialogRef: MatDialogRef<LevelupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.tempPoints = this.data.player.skillPoints;
    this.tempStats = Utils.deepCopyFunction(this.data.player.getBaseStats());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updatePoints(event) {
    console.log(event);
    // this.tempPoints = Object.values(this.tempStats).reduce((a: number, b: number) => a + b, 0)
  }

  levelup() {
    this.data.player.setBaseStats(this.tempStats);
    this.dialogRef.close();
    console.log(this.data.player);
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

}
