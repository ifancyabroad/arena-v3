import { Component, OnInit } from '@angular/core';
import { Skill } from 'src/app/shared/interfaces/skill';
import { Enemy } from 'src/app/shared/classes/enemy';
import { SkillsService } from 'src/app/shared/services/skills.service';
import { EnemiesService, EnemyData } from 'src/app/shared/services/enemies.service';
import { switchMap } from 'rxjs/operators';
import Utils from '../../shared/utils';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss']
})
export class ArenaComponent implements OnInit {
  skills: Skill[];
  enemies: EnemyData[];
  enemy: Enemy;

  constructor(
    private skillsService: SkillsService,
    private enemiesService: EnemiesService
  ) { }

  ngOnInit() {
    this.skillsService.getSkills().pipe(
      switchMap(skills => {
        this.skills = skills;
        return this.enemiesService.getEnemies();
      })
    ).subscribe(enemies => {
      this.enemies = enemies;
      this.setEnemy();
    });
  }

  getEnemySkills(enemy: EnemyData): Skill[] {
    return this.skills.filter(skill => enemy.skills.includes(skill.name));
  }

  setEnemy() {
    const enemyTier = this.enemies.filter(e => 2 >= e.challenge);
    const enemy = enemyTier[Utils.roll(0, enemyTier.length - 1)];

    this.enemy = new Enemy(
      enemy.name,
      enemy.portrait,
      enemy.stats,
      this.getEnemySkills(enemy),
      enemy.armour,
      enemy.magicResistance,
      enemy.expValue,
      enemy.goldValue
    );
  }

  // Check turn order and begin the round
  roundStart(playerSkill: Skill) {
    console.log(playerSkill);
  }

}
