import { Component, OnInit, ViewChild } from '@angular/core';
import { SkillsService } from 'src/app/shared/services/skills.service';
import { PlayerService } from 'src/app/shared/services/player.service';
import { Player } from 'src/app/shared/classes/player';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Skill } from 'src/app/shared/interfaces/skill';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss']
})
export class TrainerComponent implements OnInit {
  player: Player;

  columnsToDisplay = ['name', 'description', 'uses', 'level', 'price', 'select'];
  dataSource: MatTableDataSource<Skill>;
  selection = new SelectionModel<Skill>(true, []);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private playerService: PlayerService,
    private skillsService: SkillsService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.player = this.playerService.player;

    const classSkills = this.skillsService.getClassSkills(this.player.cl.name.toLowerCase());
    this.dataSource = new MatTableDataSource(classSkills);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // Check the player has enough gold
  checkGold(skills: Skill[]) {
    let goldTotal = 0;
    skills.forEach(skill => goldTotal += skill.price);
    return this.player.gold >= goldTotal;
  }

  // Check if player meets the requirements
  checkRequirements(skills: Skill[]) {
    let requirementsMet = true;
    skills.forEach(skill => {
      if (skill.level > this.player.level) {
        requirementsMet = false;
      }
    });
    return requirementsMet;
  }

  // Purchase selected skill
  buySkills(skills: Skill[]) {
    if (!this.checkGold(skills)) {
      this.modalService.openDialog(
        'Not enough gold!', 
        'You do not have enough gold to purchase these skills, please check and try again.'
      );
    } else if (!this.checkRequirements(skills)) {
      this.modalService.openDialog(
        'Requirements not met!', 
        'You do not meet the level requirements for 1 or more of the skills selected, please check and try again.'
      );
    } else {
      this.player.learnSkills(skills);
      this.selection.clear();
    }
  }

  // The label for the checkbox on the passed row
  checkboxLabel(row: Skill): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} ${row.name}`;
  }
}
