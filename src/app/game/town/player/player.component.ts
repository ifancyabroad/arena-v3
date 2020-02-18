import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService } from 'src/app/shared/services/player.service';
import { Player } from 'src/app/shared/classes/player';
import { KeyValue } from '@angular/common';
import { Skill } from 'src/app/shared/interfaces/skill';
import { MatDialog } from '@angular/material/dialog';
import { LevelupModalComponent } from './levelup-modal/levelup-modal.component';
import { ModalService } from 'src/app/shared/services/modal.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() view = 'town';
  @Input() waiting = false;
  player: Player;
  showDetails = true;

  @Output() skillUsed = new EventEmitter<Skill>();

  constructor(
    private playerService: PlayerService,
    public dialog: MatDialog,
    private modalService: ModalService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.player = this.playerService.player;
    this.showDetails = this.breakpointObserver.isMatched('(min-width: 1024px)');

    // Always show player card details on large devices
    this.breakpointObserver.observe([
      '(min-width: 1024px)'
    ]).subscribe(result => {
      if (result.matches) {
        this.showDetails = true;
      }
    })
  }

  // Use a skill when in the arena
  useSkill(skill: Skill) {
    this.skillUsed.emit(skill);
  }

  // Remove a known skill
  removeSkill(event: Event, skill: Skill) {
    event.stopPropagation();
    this.modalService.confirmDialog(
      'Confirm',
      `Are you sure you wish to remove the skill ${skill.name}?`
    ).subscribe(res => {
      if (res) {
        this.player.forgetSkill(skill);
      }
    });
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
