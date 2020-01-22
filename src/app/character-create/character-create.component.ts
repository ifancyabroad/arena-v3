import { Component, OnInit, ViewChild } from '@angular/core';
import { CharacterCreateService } from './character-create.service';
import { Class, Stats } from '../shared/interfaces/class';
import Utils from '../shared/utils';
import { MatTable } from '@angular/material/table';
import { GameStatus, StateService } from '../shared/services/state.service';
import { SkillsService } from '../shared/services/skills.service';
import { Skill } from '../shared/interfaces/skill';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.scss']
})
export class CharacterCreateComponent implements OnInit {
  portraits: string[];
  classes: Class[];
  skills: Skill[];

  name: string;
  selectedPortrait: string;
  selectedClass: Class;

  rerolls = 10;
  displayedColumns: string[] = ['name', 'value'];
  currentStats: { name: string, value: number }[] = [];
  @ViewChild('statTable', { static: true }) statTable: MatTable<any>;

  constructor(
    private characterCreateService: CharacterCreateService,
    private skillsService: SkillsService,
    private stateService: StateService
  ) { }

  ngOnInit() {
    this.characterCreateService.getPortraits().subscribe(portraits => {
      this.portraits = portraits;
      this.selectedPortrait = this.portraits[0];
    });
    this.characterCreateService.getClasses().subscribe(classes => {
      this.classes = classes;
      this.selectedClass = this.classes[0];
      this.resetStats();
    });
    this.skillsService.getSkills().subscribe(skills => {
      this.skills = skills;
    });
  }

  changePortrait(direction: number) {
    const currentIndex = this.portraits.indexOf(this.selectedPortrait);
    if (this.portraits[currentIndex + direction]) {
      this.selectedPortrait = this.portraits[currentIndex + direction];
    }
  }

  getClassSkills(cl: Class): Skill[] {
    return this.skills.filter(skill => cl.skills.includes(skill.name));
  }

  rollStats() {
    if (this.rerolls) {
      this.rerolls--;
      const minStats = this.selectedClass.minStats;
      const maxStats = this.selectedClass.maxStats;
      this.currentStats.forEach(stat => {
        stat.value = Utils.roll(minStats[stat.name], maxStats[stat.name]);
      });
      this.statTable.renderRows();
    }
  }

  resetStats() {
    const statNames = Object.keys(this.selectedClass.minStats);
    const stats = [];
    for (let stat of statNames) {
      stats.push({ name: stat, value: 0 })
    }
    this.currentStats = stats;
    this.statTable.renderRows();
  }

  create() {
    const stats = {};
    this.currentStats.forEach(stat => stats[stat.name] = stat.value);
    this.characterCreateService.createCharacter(
      this.name,
      this.selectedPortrait,
      this.selectedClass,
      stats as Stats,
      this.getClassSkills(this.selectedClass)
    );
    this.stateService.moveTo(GameStatus.InPlay);
  }

}
