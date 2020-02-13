import { Component, OnInit } from '@angular/core';
import { Class, BaseStats } from '../../shared/interfaces/class';
import { GameStatus, StateService } from '../../shared/services/state.service';
import { SkillsService } from '../../shared/services/skills.service';
import { Skill } from 'src/app/shared/interfaces/skill';
import { Config, StatData } from 'src/app/shared/config';
import { PlayerService } from 'src/app/shared/services/player.service';
import Utils from '../../shared/utils';

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

  rerolls: number;
  stats: StatData[];
  currentStats: {
    Warrior?: BaseStats,
    Mage?: BaseStats,
    Rogue?: BaseStats
  } = {};

  constructor(
    private config: Config,
    private playerService: PlayerService,
    private skillsService: SkillsService,
    private stateService: StateService
  ) { }

  ngOnInit() {
    this.rerolls = this.config.rerolls;
    this.stats = this.config.stats.filter(stat => stat.type === 'main');

    this.portraits = this.config.portraits;
    this.selectedPortrait = this.portraits[0];

    this.classes = this.config.classes;
    this.classes.forEach(cl => this.rollStats(cl));
    this.selectedClass = this.classes[0];
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
      this.playerService.createCharacter(
        this.name,
        this.selectedPortrait,
        this.selectedClass,
        this.currentStats[this.selectedClass.name],
        { armour: 0, magicResistance: 0 },
        Utils.deepCopyFunction(this.skillsService.getSkillsFromArray(this.selectedClass.skills))
      );
      this.stateService.moveTo(GameStatus.Town);
    }
  }

  checkValid(): boolean {
    return !!(this.name && this.name.length);
  }

}
