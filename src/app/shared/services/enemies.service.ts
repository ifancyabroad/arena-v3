import { Injectable } from '@angular/core';
import { Stats } from '../interfaces/class';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface EnemyData {
  readonly name: string;
  readonly portrait: string;
  readonly stats: Stats;
  readonly skills: string[];
  readonly challenge: number;
  readonly armour: number;
  readonly magicResistance: number;
  readonly expValue: number;
  readonly goldValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnemiesService {
  enemies: EnemyData[];

  constructor(private http: HttpClient) { }

  // Get full list of enemies
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
}
