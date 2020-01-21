import { Component, OnInit, ViewChild } from '@angular/core';
import { CharacterCreateService } from './character-create.service';
import { Class } from '../shared/interfaces/class';
import Utils from '../shared/utils';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.scss']
})
export class CharacterCreateComponent implements OnInit {
  portraits: string[];
  classes: Class[];

  name: string;
  selectedPortrait: string;
  selectedClass: Class;

  rerolls = 10;
  displayedColumns: string[] = ['name', 'value'];
  currentStats: { name: string, value: number }[] = [];
  @ViewChild('statTable', { static: true }) statTable: MatTable<any>;

  constructor(private characterCreateService: CharacterCreateService) { }

  ngOnInit() {
    this.characterCreateService.getPortraits().subscribe(portraits => {
      this.portraits = portraits;
      this.selectedPortrait = this.portraits[0];
    });
    this.characterCreateService.getClasses().subscribe(classes => {
      this.classes = classes;
      this.selectedClass = this.classes[0];
      this.resetStats();
    });
  }

  rollStats() {
    if (this.rerolls) {
      this.rerolls--;
      const minStats = this.selectedClass.minStats;
      const maxStats = this.selectedClass.maxStats;
      this.currentStats.forEach(stat => {
        stat.value = Utils.roll(minStats[stat.name], maxStats[stat.name]);
      });
      this.statTable.renderRows();
    }
  }

  resetStats() {
    const statNames = Object.keys(this.selectedClass.minStats);
    const stats = [];
    for (let stat of statNames) {
      stats.push({ name: stat, value: 0 })
    }
    this.currentStats = stats;
    this.statTable.renderRows();
  }

}
