import { Injectable } from '@angular/core';
import { BaseStats, DefenseStats } from '../interfaces/class';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SkillsService } from './skills.service';
import { Enemy } from '../classes/enemy';
import Utils from '../../shared/utils';

export interface EnemyData {
  readonly name: string;
  readonly portrait: string;
  readonly stats: BaseStats;
  readonly defense: DefenseStats;
  readonly skills: string[];
  readonly challenge: number;
  readonly expValue: number;
  readonly goldValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnemiesService {
  private enemies: EnemyData[];

  constructor(
    private http: HttpClient,
    private skillsService: SkillsService
  ) { }

  // Get full list of enemies data
  getEnemies(): Observable<EnemyData[]> {
    if (this.enemies) {
      return of(this.enemies);
    } else {
      return this.http.get<EnemyData[]>('./assets/data/enemies.json').pipe(
        tap(data => {
          if (data) {
            this.enemies = data;
            return this.enemies;
          }
        })
      );
    }
  }

  // Create an enemy
  createEnemy(challenge?: number): Enemy {
    const enemyTier = this.enemies.filter(e => challenge >= e.challenge);
    const enemy = enemyTier[Utils.roll(0, enemyTier.length - 1)];

    return new Enemy(
      enemy.name,
      enemy.portrait,
      enemy.stats,
      enemy.defense,
      Utils.deepCopyFunction(this.skillsService.getSkillsFromArray(enemy.skills)),
      enemy.expValue,
      enemy.goldValue
    );
  }
}
