import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-combat-log',
  templateUrl: './combat-log.component.html',
  styleUrls: ['./combat-log.component.scss']
})
export class CombatLogComponent implements OnInit {
  @Input() log: string[] = [];

  constructor() { }

  ngOnInit() {
  }

}
