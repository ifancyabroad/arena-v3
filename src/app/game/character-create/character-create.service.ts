import { Injectable } from '@angular/core';
import { Class, Stats } from '../../shared/interfaces/class';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlayerService } from '../../shared/services/player.service';
import { Player } from '../../shared/classes/player';
import { Skill } from '../../shared/interfaces/skill';

@Injectable({
  providedIn: 'root'
})
export class CharacterCreateService {
  private portraits: string[];
  private classes: Class[];

  constructor(private http: HttpClient, private playerService: PlayerService) { }

  getPortraits(): Observable<string[]> {
    if (this.portraits) {
      return of(this.portraits);
    } else {
      return this.http.get<string[]>('./assets/data/portraits.json').pipe(
        tap(data => {
          if (data) {
            this.portraits = data;
            return this.portraits;  
          }
        })
      );
    }
  }

  getClasses(): Observable<Class[]> {
    if (this.classes) {
      return of(this.classes);
    } else {
      return this.http.get<Class[]>('./assets/data/classes.json').pipe(
        tap(data => {
          if (data) {
            this.classes = data;
            return this.classes;  
          }
        })
      );
    }
  }

  createCharacter(
    name: string,
    portrait: string,
    cl: Class,
    stats: Stats,
    skills: Skill[]
  ) {
    this.playerService.player = new Player(
      name,
      portrait,
      cl,
      stats,
      skills
    );
    console.log(this.playerService.player);
  }
}
