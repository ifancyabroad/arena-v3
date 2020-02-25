import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Skill } from '../../interfaces/skill';
import { Item } from '../../interfaces/item';
import { EnemiesService, EnemyData } from '../../services/enemies.service';
import { SkillsService } from '../../services/skills.service';
import { ItemsService } from '../../services/items.service';

interface DialogData {
  type: string;
}

@Component({
  selector: 'app-data-list-modal',
  templateUrl: './data-list-modal.component.html',
  styleUrls: ['./data-list-modal.component.scss']
})
export class DataListModalComponent implements OnInit {
  dataArray: EnemyData[] | Skill[] | Item[];

  constructor(
    public dialogRef: MatDialogRef<DataListModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private enemiesService: EnemiesService,
    private skillsService: SkillsService,
    private itemsService: ItemsService
  ) { }

  ngOnInit(): void {
    switch (this.data.type) {
      case 'enemies':
        this.enemiesService.getEnemies().subscribe(enemies => this.dataArray = enemies);
        break;
      case 'skills':
        this.skillsService.getSkills().subscribe(skills => this.dataArray = skills);
        break;
      case 'items':
        this.itemsService.getItems().subscribe(items => this.dataArray = items);
        break;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
