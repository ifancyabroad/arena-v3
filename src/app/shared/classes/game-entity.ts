import { Config } from '../config';
import { Skill, SkillEffect } from '../interfaces/skill';
import { BaseStats, DefenseStats } from '../interfaces/class';
import Utils from '../utils';

interface EntityStats {
  readonly strength?: EntityStat;
  readonly dexterity?: EntityStat;
  readonly constitution?: EntityStat;
  readonly intelligence?: EntityStat;
  readonly initiative?: EntityStat;
  readonly armour?: EntityStat;
  readonly magicResistance?: EntityStat;
}

interface EntityStat {
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly base: number;
  modifier: number;
  battle: number;
  total: number;
}

export class GameEntity {
  config = new Config; // Get config

  stats: EntityStats; // Entity main stats
  activeEffects: SkillEffect[] = []; // Currently active effects
  health: number; // Current health of entity

  constructor(
    public name: string,
    public portrait: string,
    public baseStats: BaseStats,
    public defenseStats: DefenseStats,
    public skills: Skill[],
  ) {
    // All stats for entity
    // The 5 main stats are set using base stats received in the constructor
    // Defense stats are set separately as only enemies are initialised with these
    this.stats = {};
    this.config.stats.forEach(stat => {
      this.stats[stat.key] = {
        name: stat.name,
        description: stat.description,
        type: stat.type,
        base: stat.type === 'main' ? baseStats[stat.key] : defenseStats[stat.key],
        modifier: 0,
        battle: 0,
        get total(): number {
          return this.base + this.modifier + this.battle;
        }
      }
    });

    // Set the entities health to it's max health when initialised
    // Max health is accessed via a getter
    this.health = this.maxHealth;
  }

  // Stat getters
  get maxHealth(): number {
    return this.stats.constitution.total * this.config.healthMultiplier;
  }

  get isAlive(): boolean {
    return this.health > 0;
  }

  get hitChance(): number {
    return this.stats.dexterity.total * this.config.hitMultiplier;
  }

  get critChance(): number {
    return this.stats.dexterity.total * this.config.critMultiplier;
  }

  // Stat checks
  checkHit = (): boolean => this.hitChance >= Utils.roll(1, 100) ? true : false;
  checkCrit = (): boolean => this.critChance >= Utils.roll(1, 100) ? true : false;
  checkResistance = (damage: number, stat: number): number => damage - stat < 0 ? 0 : damage - stat;

  // Health modifiers
  setFullHealth(): void {
    this.health = this.maxHealth;
  }

  heal(health: number): void {
    this.health = this.health + health > this.maxHealth ? this.maxHealth : this.health + health;
  }

  takeHit(damage: number): void {
    this.health = this.health - damage > 0 ? this.health - damage : 0;
  }

  // Skill modifiers
  useSkill(skill: Skill): void {
    skill.uses--;
  }

  resetSkills(): void {
    this.skills.forEach(skill => skill.uses = skill.maxUses);
  }

  // Get damage based on stats
  getDamage = (effect: SkillEffect): number => Math.floor(
    this.stats[effect.modifier].total * effect.multiplier +
    Utils.roll(effect.min, effect.max)
  )

  // Effect management
  effectActive = (effect: SkillEffect): boolean => this.activeEffects.includes(effect);
  effectHit = (effect: SkillEffect): boolean => effect.accuracy >= Utils.roll(1, 100);

  checkEffects = (): boolean => this.activeEffects.filter(effect => effect.type === 'incapacitate').length === 0;

  addEffect(effect: SkillEffect): void {
    if (effect.modifiers) {
      this.updateEffectModifiers(effect, 'add');
    }
    effect.remaining = effect.duration;
    this.activeEffects.push(effect);
  }

  removeEffect(index: number, effect: SkillEffect) {
    if (effect.modifiers) {
      this.updateEffectModifiers(effect, 'remove');
    }
    this.activeEffects.splice(index, 1);
  }

  updateEffectModifiers(effect: SkillEffect, change: string) {
    if (change === 'add') {
      for (let modifier of Object.keys(effect.modifiers)) {
        this.stats[modifier].battle += effect.modifiers[modifier];
      }
    } else if (change === 'remove') {
      for (let modifier of Object.keys(effect.modifiers)) {
        this.stats[modifier].battle -= effect.modifiers[modifier];
      }
    }
  }

  removeEffects(): void {
    for (let stat of Object.keys(this.stats)) {
      this.stats[stat].battle = 0;
    }
    this.activeEffects.splice(0);
  }

  refreshEffect(effect: SkillEffect): void {
    this.activeEffects[this.activeEffects.indexOf(effect)].remaining = effect.duration;
  }

  updateEffects(): void {
    for (let i = this.activeEffects.length - 1; i >= 0; i--) {
      this.activeEffects[i].remaining--;
      if (this.activeEffects[i].remaining < 0) {
        this.removeEffect(i, this.activeEffects[i]);
      }
    }
  }

  // Getting and setting stat values
  getBaseStats(): EntityStats  {
    let baseStats: EntityStats = {};
    Object.keys(this.stats).forEach(stat => {
      if (this.stats[stat].type === 'main') {
        baseStats[stat] = this.stats[stat].base;
      }
    });
    return baseStats;
  }

  setBaseStats(newStats: BaseStats) {
    Object.keys(this.stats).forEach(stat => {
      if (this.stats[stat].type === 'main') {
        this.stats[stat].base = newStats[stat];
      }
    });
  }

  getDetailedStats(type?: string): EntityStat[] {
    let stats = Object.values(this.stats);
    return type ? stats.filter(stat => stat.type === type) : stats;
  };
}
