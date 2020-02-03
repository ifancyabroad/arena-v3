import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from 'src/app/shared/classes/player';

interface DialogData {
  player: Player;
}

@Component({
  selector: 'app-levelup-modal',
  templateUrl: './levelup-modal.component.html',
  styleUrls: ['./levelup-modal.component.scss']
})
export class LevelupModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LevelupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  levelup() {

  }

}
