import { Player } from 'src/app/shared/classes/player';
import { Enemy } from 'src/app/shared/classes/enemy';
import { Skill, SkillEffect } from 'src/app/shared/interfaces/skill';
import { BehaviorSubject, Subject } from 'rxjs';

export enum BattleState {
  Waiting, Turn, Victory, Defeat
}

interface Round {
  playerAction: Skill,
  turn: Turn,
}

interface Turn {
  readonly counter: number;
  readonly attacker: Player | Enemy;
  readonly defender: Player | Enemy;
  readonly skill: Skill;
  action: {
    incapacitated: boolean;
    plane: string;
    attack: boolean;
    hit: boolean;
    attacks: EffectData[],
    heals: EffectData[],
    effects: EffectData[]
  };
}

interface EffectData {
  target?: Player | Enemy;
  hitType?: 'hit' | 'crit' | 'miss';
  value?: number;
  effect?: SkillEffect;
  existing?: boolean;
}

export class Battle {
  state = BattleState.Waiting;
  state$ = new BehaviorSubject<BattleState>(BattleState.Waiting);
  round: Round;
  combatLog: Subject<string> = new Subject<string>();
  
  constructor(
    public player: Player,
    public enemy: Enemy
  ) { }

  // Initiates the round
  // Triggered from the arena component when the user selects a skill to use
  startRound(skill: Skill) {
    if (this.speedCheck()) {
      this.setRound(this.player, this.enemy, skill, 1);
    } else {
      this.setRound(this.enemy, this.player, skill, 1);
    }
    this.state = BattleState.Turn;
    this.turn();
  }

  // Set the round details
  private setRound(
    attacker: Player | Enemy,
    defender: Player | Enemy,
    playerAction: Skill,
    counter: number
  ) {
    const skill = attacker.type === 'player' ? playerAction : this.enemy.getAction(this.player);
    this.round = {
      playerAction: playerAction,
      turn: {
        counter: counter,
        attacker: attacker,
        defender: defender,
        skill: skill,
        action: {
          incapacitated: false,
          plane: skill.plane,
          attack: false,
          hit: false,
          attacks: [],
          heals: [],
          effects: []
        }
      }
    }
  }

  // Process the effects of whichever skill is used for a turn
  private turn() {
    if (this.round.turn.attacker.checkEffects()) {
      this.getEffects();
      this.processEffects();
    } else {
      this.round.turn.action.incapacitated = true;
    }
    console.log(this.round);
    this.turnChecks();
  }

  // End of the turn
  // Check the current state of both entities
  private turnChecks() {
    if (!this.round.turn.defender.isAlive && this.round.turn.defender.type === 'enemy') {
      this.player.removeEffects();
      this.state = BattleState.Victory;
      this.state$.next(this.state);
    } else if (!this.round.turn.defender.isAlive && this.round.turn.defender.type === 'player') {
      this.state = BattleState.Defeat;
      this.state$.next(this.state);
    } else if (this.round.turn.counter === 2) {
      this.player.updateEffects();
      this.enemy.updateEffects();
      this.state = BattleState.Waiting;
      this.state$.next(this.state);
    }

    // Log the turn to the combat log
    this.log(this.round.turn);

    // Continue to slower entity turn
    if (this.state === BattleState.Turn) {
      this.setRound(this.round.turn.defender, this.round.turn.attacker, this.round.playerAction, 2);
      this.turn();
    }
  }

  // Get data of every effect in the skill that was used
  // Checks if the skill hits as well as getting damage values and setting the target
  private getEffects() {
    this.round.turn.attacker.useSkill(this.round.turn.skill);
    this.round.turn.skill.effects.forEach(effect => {
      switch (effect.type) {

        // Damage based effects
        // Must check they hit and how much damage they cause
        case 'damage':
          const attack: EffectData = this.attack(
            this.round.turn.attacker,
            this.round.turn.defender,
            this.round.turn.skill.plane,
            effect
          );
          
          this.round.turn.action.attack = true;
          if (attack.hitType !== 'miss') {
            this.round.turn.action.hit = true;
          }
          
          this.round.turn.action.attacks.push(attack);
          break;

        // Heal based effects
        case 'heal':
          const heal: EffectData = this.heal(this.round.turn.attacker, effect);
          this.round.turn.action.heals.push(heal);
          break;

        // Incapacitation effects
        case 'incapacitate':
          const inc: EffectData = this.effect(
            this.round.turn.attacker,
            this.round.turn.defender,
            effect
          );
          this.round.turn.action.effects.push(inc);
          break;

        // Buff effects
        case 'buff':
          const buff: EffectData = this.effect(
            this.round.turn.attacker,
            this.round.turn.attacker,
            effect
          );
          this.round.turn.action.effects.push(buff);
          break;

        // Debuff effects
        case 'debuff':
          const debuff: EffectData = this.effect(
            this.round.turn.attacker,
            this.round.turn.defender,
            effect
          );          
          this.round.turn.action.effects.push(debuff);
          break;
      }
    });
  }

  // Process all the effects that were retrieved
  private processEffects() {
    // Attacks
    this.round.turn.action.attacks.forEach(attack => {
      if (attack.hitType !== 'miss') {
        attack.target.takeHit(attack.value);
      }
    });

    // All other effects
    if (!this.round.turn.action.attack || this.round.turn.action.hit) {

      // Heals
      this.round.turn.action.heals.forEach(heal => {
        heal.target.heal(heal.value);
      });

      // Buffs, debuffs and incapacitation
      this.round.turn.action.effects.forEach(effect => {
        if (effect.hitType !== 'miss') {
          if (effect.existing) {
            effect.target.refreshEffect(effect.effect);
          } else {
            effect.target.addEffect(effect.effect)
          }
        }
      });
    }
  }

  // The below methods are for retrieving the relevant data from each type of skill
  // Current types are - attack | heal | effect (includes incapacitation, buffs and debuffs)
  private attack(
    user: Player | Enemy,
    target: Player | Enemy,
    plane: string,
    effect: SkillEffect
  ) {
    let attackData: EffectData = { target: target };
    if (plane === 'physical') {
      if (user.checkHit()) {
        attackData.value = target.checkResistance(user.getDamage(effect), target.stats.armour.total);
        attackData.hitType = 'hit';
        if (user.checkCrit()) {
          attackData.value *= 2;
          attackData.hitType = 'crit';
        }
      } else {
        attackData.hitType = 'miss';
      }
    } else if (plane === 'magical') {
      attackData.value = target.checkResistance(user.getDamage(effect), target.stats.magicResistance.total);
      attackData.hitType = 'hit';
    }
    return attackData;
  }

  private heal(target: Player | Enemy, effect: SkillEffect) {
    return { target: target, value: effect.value }
  }

  private effect(
    user: Player | Enemy,
    target: Player | Enemy,
    effect: SkillEffect
  ) {
    let effectData: EffectData = { target: target, effect: effect };
    if (user.effectHit(effect)) {
      effectData.hitType = 'hit';
      effectData.existing = target.effectActive(effect) ? true : false;
    } else {
      effectData.hitType = 'miss';
    }
    return effectData;
  }

  private speedCheck = () => this.player.stats.initiative.total >= this.enemy.stats.initiative.total;

  // Emit the combat log data
  private log(turn: Turn) {

    // Log ability use or incapacitated
    if (turn.action.incapacitated) {
      this.combatLog.next(`${turn.attacker.name} is incapacitated and unable to move.`);
    } else {
      this.combatLog.next(`${turn.attacker.name} uses ${turn.skill.name}.`);
    }

    // Log any attacks that were made
    turn.action.attacks.forEach(attack => {
      if (attack.hitType === 'miss') {
        this.combatLog.next(`${turn.skill.name} misses.`);
      } else {
        this.combatLog.next(`${turn.skill.name} ${attack.hitType}s for ${attack.value} damage!`);
      }
    });

    // Log any heals
    turn.action.heals.forEach(heal => this.combatLog.next(`${turn.skill.name} heals for ${heal.value}.`));

    // Log any other skill types
    turn.action.effects.forEach(effect => {
      if (effect.hitType !== 'miss') {
        switch (effect.effect.type) {
          case 'buff':
            Object.keys(effect.effect.modifiers).forEach(stat => {
              const value = effect.effect.modifiers[stat];
              this.combatLog.next(`${effect.target.name}'s ${stat} is ${value >= 0 ? 'increased' : 'decreased'} by ${value}.`);
            });
            break;

          case 'debuff':
            Object.keys(effect.effect.modifiers).forEach(stat => {
              const value = effect.effect.modifiers[stat];
              this.combatLog.next(`${effect.target.name}'s ${stat} is ${value >= 0 ? 'increased' : 'decreased'} by ${value}.`);
            });
            break;

          case 'incapacitate':
            if (effect.hitType === 'hit') {
              this.combatLog.next(`${effect.target.name} is successfully incapcitated.`);
            }
            break;
        }
      }
    });

    // Log victory or defeat
    if (this.state === BattleState.Victory) {
      this.combatLog.next(`${this.player.name} slays the ${this.enemy.name}!`);
      this.combatLog.next(`${this.player.name} receives ${this.enemy.expValue} experience!`);
      this.combatLog.next(`${this.player.name} is rewarded with ${this.enemy.goldValue} gold!`);
    } else if (this.state === BattleState.Defeat) {
      this.combatLog.next(`${this.player.name} has been slain.`);
    }
  }
}
