import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService } from 'src/app/shared/services/player.service';
import { Player } from 'src/app/shared/classes/player';
import { KeyValue } from '@angular/common';
import { Skill } from 'src/app/shared/interfaces/skill';
import { MatDialog } from '@angular/material/dialog';
import { LevelupModalComponent } from './levelup-modal/levelup-modal.component';

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

  constructor(
    private playerService: PlayerService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.player = this.playerService.player;
  }

  // Use a skill when in the arena
  useSkill(skill: Skill) {
    this.skillUsed.emit(skill);
  }

  // Remove a known skill
  removeSkill(skill: Skill) {
    this.player.forgetSkill(skill);
  }

  // Levelup if skill points available
  levelup(): void {
    const dialogRef = this.dialog.open(LevelupModalComponent, {
      width: '300px',
      data: { player: this.player }
    });
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

}
