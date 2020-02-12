import { Component, OnInit, Input } from '@angular/core';
import { Enemy } from 'src/app/shared/classes/enemy';

@Component({
  selector: 'app-enemy',
  templateUrl: './enemy.component.html',
  styleUrls: ['./enemy.component.scss']
})
export class EnemyComponent implements OnInit {
  @Input() enemy: Enemy;

  constructor() { }

  ngOnInit() {
  }

}
