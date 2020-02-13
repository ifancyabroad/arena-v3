import { Injectable } from '@angular/core';
import { Player } from '../classes/player';
import { Class, BaseStats, DefenseStats } from '../interfaces/class';
import { Skill } from '../interfaces/skill';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  player: Player;

  constructor() { }

  createCharacter(
    name: string,
    portrait: string,
    cl: Class,
    stats: BaseStats,
    defense: DefenseStats,
    skills: Skill[]
  ) {
    this.player = new Player(
      name,
      portrait,
      cl,
      stats,
      defense,
      skills
    );
  }
}
