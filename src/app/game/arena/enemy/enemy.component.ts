import { Component, OnInit, Input } from '@angular/core';
import { Enemy } from 'src/app/shared/classes/enemy';
import { KeyValue } from '@angular/common';

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

  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

}
