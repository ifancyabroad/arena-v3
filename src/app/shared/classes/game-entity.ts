import Utils from '../utils';
import { Config } from '../config';
import { Skill, SkillEffect } from '../interfaces/skill';
import { Stats } from '../interfaces/class';

interface EntityStats {
  readonly strength: EntityStat;
  readonly dexterity: EntityStat;
  readonly constitution: EntityStat;
  readonly intelligence: EntityStat;
  readonly initiative: EntityStat;
  readonly armour: EntityStat;
  readonly magicResistance: EntityStat;
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
    public baseStats: Stats,
    public skills: Skill[],
    public armour = 0,
    public magicResistance = 0
  ) {
    // All stats for entity
    // The 5 main stats are set using base stats received in the constructor
    // Defense stats are set separately as only enemies are initialised with these
    this.stats = {
      strength: {
        name: 'Strength',
        description: 'How much damage your physical attacks do.',
        type: 'main',
        base: baseStats.strength,
        modifier: 0,
        battle: 0,
        get total(): number {
          return this.base + this.modifier + this.battle;
        }
      },
      dexterity: {
        name: 'Dexterity',
        description: 'The chance your physical attacks hit and critical hit.',
        type: 'main',
        base: baseStats.dexterity,
        modifier: 0,
        battle: 0,
        get total(): number {
          return this.base + this.modifier + this.battle;
        }
      },
      constitution: {
        name: 'Constitution',
        description: 'Determines your maximum health.',
        type: 'main',
        base: baseStats.constitution,
        modifier: 0,
        battle: 0,
        get total(): number {
          return this.base + this.modifier + this.battle;
        }
      },
      intelligence: {
        name: 'Intelligence',
        description: 'How much damage your magical attacks do.',
        type: 'main',
        base: baseStats.intelligence,
        modifier: 0,
        battle: 0,
        get total(): number {
          return this.base + this.modifier + this.battle;
        }
      },
      initiative: {
        name: 'Initiative',
        description: 'Determines who strikes first.',
        type: 'main',
        base: baseStats.initiative,
        modifier: 0,
        battle: 0,
        get total(): number {
          return this.base + this.modifier + this.battle;
        }
      },
      armour: {
        name: 'Armour',
        description: 'Offers protection from physical attacks',
        type: 'defense',
        base: armour,
        modifier: 0,
        battle: 0,
        get total(): number {
          return this.base + this.modifier + this.battle;
        }
      },
      magicResistance: {
        name: 'Magic Resistance',
        description: 'Offers protection from magical attacks',
        type: 'defense',
        base: magicResistance,
        modifier: 0,
        battle: 0,
        get total(): number {
          return this.base + this.modifier + this.battle;
        }
      }
    };

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

  resetSkill(): void {
    this.skills.forEach(skill => skill.uses = skill.maxUses);
  }

  // Get damage based on stats
  getDamage = (effect: SkillEffect): number => Math.floor(
    this.stats[effect.modifier].total * effect.multiplier +
    Utils.roll(effect.min, effect.max)
  )

  // Effects
  effectActive = (effect: SkillEffect): boolean => this.activeEffects.indexOf(effect) > -1;
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

  // Get specific stat types
  getStats(type?: string): Object {
    let stats = {};
    if (!type) {
      stats = this.stats;
    } else {
      for (let stat of Object.keys(this.stats)) {
        if (this.stats[stat].type === type) {
          stats[stat] = this.stats[stat];
        }
      }
    }
    return stats;
  };
}
