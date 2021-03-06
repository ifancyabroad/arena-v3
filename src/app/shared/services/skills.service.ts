import { Injectable } from '@angular/core';
import { Skill } from '../interfaces/skill';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private skills: Skill[];

  constructor(private http: HttpClient) { }

  getSkills(): Observable<Skill[]> {
    if (this.skills) {
      return of(this.skills);
    } else {
      return this.http.get<Skill[]>('./assets/data/skills.json').pipe(
        tap(data => {
          if (data) {
            this.skills = data;
            this.skills.forEach(skill => skill.uses = skill.maxUses);
            return this.skills;
          }
        })
      );
    }
  }

  getClassSkills(className: string): Skill[] {
    return this.skills.filter(skill => skill.class === className.toLowerCase() && skill.level > 0);
  }

  getSkillsFromArray(skillsArray: string[]): Skill[] {
    return this.skills.filter(skill => skillsArray.includes(skill.name));
  }
}
