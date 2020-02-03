import { GameEntity } from './game-entity';
import { Skill } from '../interfaces/skill';
import { Stats, Class } from '../interfaces/class';
import { Item } from '../interfaces/item';
import Utils from '../utils';

export class Player extends GameEntity {
  type = 'player';

  level = 1; // Start at level 1
  kills = 0; // Kills starts at 0;
  experience = 0; // Experience starts at 0
  levelingTier: Array<Object>;
  skillPoints: number; // Skill points available for spending
  gold: number; // Gold starts at 0
  rerolls: number; // 10 initial rerolls allowed
  maxSkills: number; // Maximum skills that can be learnt

  // Inventory starts empty
  inventory = {
    head: null,
    body: null,
    gloves: null,
    boots: null,
    weapon: null,
    misc: null
  };

  constructor(
    public name: string,
    public portrait: string,
    public cl: Class,
    public baseStats: Stats,
    public skills: Skill[]
  ) {
    super(name, portrait, baseStats, skills);

    this.levelingTier = this.config.levelTier;
    this.skillPoints = this.config.skillPoints;
    this.gold = this.config.gold;
    this.rerolls = this.config.rerolls;
    this.maxSkills = this.config.maxSkills;
  }

  // Find what level the player has earned through exp
  get levelTier(): number {
    return this.levelingTier.filter(level => this.experience >= level['exp']).pop()['level'];
  }

  // Experience
  addExperience(xp: number): void {
    const currentTier = this.levelTier;
    this.experience += xp;
    if (currentTier !== this.levelTier) {
      this.skillPoints += 1;
    }
  }

  // Gold
  addGold(gold: number): void {
    this.gold += gold;
  }

  // Purchase item
  buyItem(item: Item) {
    this.gold -= item.price;
    this.updateInventory(item);
  }

  // Inventory management
  updateInventory(item: Item): void {
    if (this.inventory[item.type] && this.stats[this.inventory[item.type].modifier]) {
      this.stats[this.inventory[item.type].modifier].modifier -= this.inventory[item.type].value;
    }
    this.inventory[item.type] = item;
    this.stats[this.inventory[item.type].modifier].modifier += this.inventory[item.type].value;
  }

  // Skills
  learnSkills(skills: Skill[]): void {
    skills.forEach(skill => this.gold -= skill.price);
    this.skills.push(...Utils.deepCopyFunction(skills));
  }

  forgetSkill(skill: Skill): void {
    this.skills.splice(this.skills.indexOf(skill), 1);
  }
}
