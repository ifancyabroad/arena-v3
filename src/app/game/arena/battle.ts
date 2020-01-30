import { Player } from 'src/app/shared/classes/player';
import { Enemy } from 'src/app/shared/classes/enemy';
import { Skill, SkillEffect } from 'src/app/shared/interfaces/skill';
import { BehaviorSubject } from 'rxjs';

export enum BattleState {
  Waiting, Turn, Victory, Defeat
}

enum RoundState {
  PlayerTurn, EnemyTurn
}

interface Turn {
  readonly counter: number;
  readonly attacker: Player | Enemy;
  readonly defender: Player | Enemy;
  readonly skill: Skill;
}

interface Round {
  roundState: RoundState,
  playerAction: Skill,
  turn: Turn,
}

interface Attack {
  damage?: number;
  action?: string;
}

export class Battle {
  state = new BehaviorSubject<BattleState>(BattleState.Waiting);
  round: Round;

  constructor(
    public player: Player,
    public enemy: Enemy
  ) { }

  private speedCheck = () => this.player.stats.initiative.total >= this.enemy.stats.initiative.total;

  private setRound(
    attacker: Player | Enemy,
    defender: Player | Enemy,
    playerAction: Skill,
    counter: number
  ) {
    this.round = {
      roundState: attacker.type === 'player' ?
        RoundState.PlayerTurn :
        RoundState.EnemyTurn,
      playerAction: playerAction,
      turn: {
        counter: counter,
        attacker: attacker,
        defender: defender,
        skill: attacker.type === 'player' ?
          playerAction :
          this.enemy.getAction(this.player)
      }
    }
  }

  startRound(skill: Skill) {
    if (this.speedCheck()) {
      this.setRound(this.player, this.enemy, skill, 1);
    } else {
      this.setRound(this.enemy, this.player, skill, 1);
    }
    this.turn();
    this.endTurn();
  }

  private turn() {
    if (this.round.turn.attacker.checkEffects()) {
      this.handleSkill();
    }
  }

  private endTurn() {
    if (!this.round.turn.defender.isAlive) {
      if (this.round.turn.defender.type === 'enemy') {
        this.state.next(BattleState.Victory);
      } else {
        this.state.next(BattleState.Defeat);
      }
    } else if (this.round.turn.counter === 2) {
      this.state.next(BattleState.Waiting);
    } else {
      this.setRound(this.round.turn.defender, this.round.turn.attacker, this.round.playerAction, 2)
      this.turn();
    } 
  }

  private handleSkill() {
    let attack: Attack = {};
    this.round.turn.attacker.useSkill(this.round.turn.skill);
    this.round.turn.skill.effects.forEach(effect => {
      switch (effect.type) {
        case 'damage':
          attack = this.attack(
            this.round.turn.attacker,
            this.round.turn.defender,
            this.round.turn.skill.plane,
            effect
          );
          break;

        case 'heal':
          if (attack.action !== 'miss') {
            this.heal(this.round.turn.attacker, effect);
          }
          break;

        case 'incapacitate':
          if (attack.action !== 'miss' && this.round.turn.attacker.effectHit(effect)) {
            this.effect(this.round.turn.defender, effect, this.round.turn.skill);
          }
          break;

        case 'buff':
          if (attack.action !== 'miss' && this.round.turn.attacker.effectHit(effect)) {
            this.effect(this.round.turn.attacker, effect, this.round.turn.skill);
          }
          break;

        case 'debuff':
          if (attack.action !== 'miss' && this.round.turn.attacker.effectHit(effect)) {
            this.effect(this.round.turn.defender, effect, this.round.turn.skill);
          }
          break;
      }
    });
  }

  private attack(
    attacker: Player | Enemy,
    defender: Player | Enemy,
    plane: string,
    effect: SkillEffect
  ) {
    let attack: Attack = {};
    if (plane === 'physical') {
      if (attacker.checkHit()) {
        attack.damage = defender.checkResistance(attacker.getDamage(effect), defender.stats.armour.total);
        attack.action = 'hit';
        if (attacker.checkCrit()) {
          attack.damage *= 2;
          attack.action = 'crit';
        }
        defender.takeHit(attack.damage);
      } else {
        attack.action = 'miss';
      }
    } else if (plane === 'magical') {
      attack.damage = defender.checkResistance(attacker.getDamage(effect), defender.stats.magicResistance.total);
      defender.takeHit(attack.damage);
      attack.action = 'hit';
    }
    return attack;
  }

  private heal(entity: Player | Enemy, effect: SkillEffect) {
    entity.heal(effect.value);
  }

  private effect(entity: Player | Enemy, effect: SkillEffect, skill: Skill) {
    if (entity.effectActive(effect)) {
      entity.refreshEffect(effect);
    } else {
      // effect.name = skill.name;
      effect.remaining = effect.duration;
      entity.addEffect(effect);
    }
  }
}
