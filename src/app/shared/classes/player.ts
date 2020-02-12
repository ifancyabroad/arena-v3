import { GameEntity } from './game-entity';
import { Skill } from '../interfaces/skill';
import { Stats, Class } from '../interfaces/class';
import { Item } from '../interfaces/item';
import { LevelTier, RankTier } from '../config';
import Utils from '../utils';

export class Player extends GameEntity {
  type = 'player';

  level = 1; // Start at level 1
  kills = 0; // Kills starts at 0;
  experience = 0; // Experience starts at 0
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

    this.skillPoints = this.config.skillPoints;
    this.gold = this.config.gold;
    this.rerolls = this.config.rerolls;
    this.maxSkills = this.config.maxSkills;
  }

  // Find what level the player has earned through exp
  get levelTier(): LevelTier {
    return this.config.levelTier.filter(level => this.experience >= level.exp).pop();
  }

  // Find out what rank the player currently is
  get rankTier(): RankTier {
    return this.config.rankTier.filter(rank => this.kills >= rank.kills).shift();
  }

  // Kills
  addKill() {
    this.kills++;
  }

  // Experience
  addExperience(xp: number): void {
    const currentTier = this.levelTier;
    this.experience += xp;
    if (currentTier !== this.levelTier) {
      this.skillPoints += 1;
    }
  }

  levelup(stats: Stats, points: number): void {
    this.level += this.skillPoints - points;
    this.skillPoints = points;
    this.setBaseStats(stats);
  }

  // Gold
  addGold(gold: number): void {
    this.gold += gold;
  }

  // Items
  buyItem(item: Item): void {
    this.gold -= item.price;
    if (this.inventory[item.type]) {
      this.unequip(item.type);
    }
    this.equip(item);
  }

  equip(item: Item): void {
    this.inventory[item.type] = item;
    Object.keys(this.inventory[item.type].modifiers).forEach(
      stat => this.stats[stat].modifier += this.inventory[item.type].modifiers[stat]
    );
  }

  unequip(type: string): void {
    Object.keys(this.inventory[type].modifiers).forEach(
      stat => this.stats[stat].modifier -= this.inventory[type].modifiers[stat]
    );
    this.inventory[type] = null;
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
