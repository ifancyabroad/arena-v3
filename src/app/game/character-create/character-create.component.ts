import { Component, OnInit } from '@angular/core';
import { CharacterCreateService } from './character-create.service';
import { Class, Stats } from '../../shared/interfaces/class';
import { GameStatus, StateService } from '../../shared/services/state.service';
import { SkillsService } from '../../shared/services/skills.service';
import Utils from '../../shared/utils';
import { KeyValue } from '@angular/common';
import { Skill } from 'src/app/shared/interfaces/skill';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.scss']
})
export class CharacterCreateComponent implements OnInit {
  portraits: string[];
  classes: Class[];

  name: string;
  selectedPortrait: string;
  selectedClass: Class;

  rerolls = 10;
  currentStats: {
    Warrior?: Stats,
    Mage?: Stats,
    Rogue?: Stats
  } = {};

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
      this.classes.forEach(cl => this.rollStats(cl));
      this.selectedClass = this.classes[0];
    });
  }

  changePortrait(direction: number) {
    const currentIndex = this.portraits.indexOf(this.selectedPortrait);
    if (this.portraits[currentIndex + direction]) {
      this.selectedPortrait = this.portraits[currentIndex + direction];
    }
  }

  getStartingSkills(): Skill[] {
    return this.skillsService.getSkillsFromArray(this.selectedClass.skills);
  }

  rollStats(cl: Class, reroll?: boolean) {
    if (reroll && !this.rerolls) {
      return
    } else if (reroll && this.rerolls) {
      this.rerolls--;
    }

    const minStats = cl.minStats;
    const maxStats = cl.maxStats;
    const rolledStats = {};
    const statKeys = Object.keys(minStats);
    statKeys.forEach(stat => {
      rolledStats[stat] = Utils.roll(minStats[stat], maxStats[stat]);
    });
    this.currentStats[cl.name] = rolledStats;
  }

  create() {
    if (this.checkValid()) {
      this.characterCreateService.createCharacter(
        this.name,
        this.selectedPortrait,
        this.selectedClass,
        this.currentStats[this.selectedClass.name],
        Utils.deepCopyFunction(this.skillsService.getSkillsFromArray(this.selectedClass.skills))
      );
      this.stateService.moveTo(GameStatus.Town);
    }
  }

  checkValid(): boolean {
    return !!(this.name && this.name.length);
  }

  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

}
