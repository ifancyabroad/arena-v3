import { GameEntity } from './game-entity';
import { Skill } from '../interfaces/skill';
import Utils from '../utils';
import { Stats } from '../interfaces/class';
import { Player } from './player';

export class Enemy extends GameEntity {
  type = 'enemy';

  constructor(
    public name: string,
    public portrait: string,
    public baseStats: Stats,
    public skills: Skill[],
    public armour = 0,
    public magicResistance = 0,
    public expValue: number,
    public goldValue: number
  ) {
    super(name, portrait, baseStats, skills, armour, magicResistance);
  }

  // AI to get the enemies choice of action
  getAction(player: Player): Skill {
    let options: Skill[] = this.skills.filter(skill => !skill.maxUses || skill.uses > 0); // Filter out skills with 0 uses

    options = this.getLowPriority(options, player);
    options = this.getHighPriority(options).length ? this.getHighPriority(options) : options;
    options = this.getMidPriority(options, player).length ? this.getMidPriority(options, player) : options;

    return options[Utils.roll(0, options.length - 1)];
  }

  // Lowest priority (remove unimportant options)
  getLowPriority(options: Skill[], player: Player) {
    return options.filter(option => {
      let reject: boolean;
      option.effects.forEach(effect => {
        // Filter out active debuffs
        if (player.effectActive(effect) && effect.type === 'debuff') {
          reject = true;
        }
        // Filter out active buffs
        if (this.effectActive(effect) && effect.type === 'buff') {
          reject = true;
        }
        // Filter out heals if health too high
        if ((this.health / this.maxHealth) * 100 > 80 && effect.type === 'heal') {
          reject = true;
        }
        // Filter out vs Warriors and Rogues
        if (player.cl.name === 'Warrior' || player.cl.name === 'Rogue') {
          if (effect.type === 'buff' && effect.modifiers.magicResistance > 0) {
            reject = true;
          }
          if (effect.type === 'debuff' && effect.modifiers.intelligence < 0) {
            reject = true;
          }
        }
        // Filter out vs Mages
        if (player.cl.name === 'Mage') {
          if (effect.type === 'buff' && effect.modifiers.armour > 0) {
            reject = true;
          }
          if (effect.type === 'debuff' &&
            (effect.modifiers.strength < 0 || effect.modifiers.dexterity < 0)) {
            reject = true;
          }
        }
      });
      return !reject;
    });
  }

  // Mid priority
  getMidPriority(options: Skill[], player: Player) {
    return options.filter(option => {
      let priority: boolean;
      option.effects.forEach(effect => {
        // Priority vs Warriors
        if (player.cl.name === 'Warrior') {
          if (effect.type === 'buff' && effect.modifiers.armour > 0) {
            priority = true;
          }
          if (effect.type === 'debuff' &&
            (effect.modifiers.dexterity < 0 || effect.modifiers.dexterity < 0)) {
            priority = true;
          }
        }
        // Priority vs Rogues
        if (player.cl.name === 'Rogue') {
          if (effect.type === 'buff' && effect.modifiers.armour > 0) {
            priority = true;
          }
          if (effect.type === 'debuff' &&
            (effect.modifiers.dexterity < 0 || effect.modifiers.initiative < 0)) {
            priority = true;
          }
        }
        // Priority vs Mages
        if (player.cl.name === 'Mage') {
          if (effect.type === 'buff' && effect.modifiers.magicResistance > 0) {
            priority = true;
          }
          if (effect.type === 'debuff' && effect.modifiers.intelligence < 0) {
            priority = true;
          }
        }
      });
      return priority;
    });
  }

  // Highest priority
  getHighPriority(options: Skill[]) {
    return options.filter(option => {
      let priority: boolean;
      option.effects.forEach(effect => {
        // Filter out everything but heals if health too low
        if ((this.health / this.maxHealth) * 100 < 40 && effect.type === 'heal') {
          priority = true;
        }
      });
      return priority;
    });
  }
}
