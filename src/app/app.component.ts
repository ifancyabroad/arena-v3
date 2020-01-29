import { Component } from '@angular/core';
import { EnemiesService } from './shared/services/enemies.service';
import { ItemsService } from './shared/services/items.service';
import { SkillsService } from './shared/services/skills.service';
import { merge } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'arena-v3';
  loaded = false;

  constructor(
    private enemiesService: EnemiesService,
    private itemsService: ItemsService,
    private skillsService: SkillsService
  ) {
    // Load JSON before allowing the app to run
    merge(
      this.enemiesService.getEnemies(),
      this.itemsService.getItems(),
      this.skillsService.getSkills()
    ).subscribe(() => this.loaded = true);
  }
}
