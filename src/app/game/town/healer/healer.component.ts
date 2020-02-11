import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/shared/classes/player';
import { PlayerService } from 'src/app/shared/services/player.service';
import { ModalService } from 'src/app/shared/services/modal.service';

interface Heal {
  name: string;
  value: number;
  price: number;
}

@Component({
  selector: 'app-healer',
  templateUrl: './healer.component.html',
  styleUrls: ['./healer.component.scss']
})
export class HealerComponent implements OnInit {
  player: Player;

  heals: Heal[] = [
    { name: 'Cure Minor Wounds', value: 30, price: 80 },
    { name: 'Cure Major Wounds', value: 60, price: 120 },
    { name: 'Cure Critical Wounds', value: 90, price: 160 }
  ];

  constructor(
    private playerService: PlayerService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.player = this.playerService.player;
  }

  // Heal specified
  healPlayer(heal: Heal) {
    if (this.player.gold < heal.price) {
      this.modalService.openDialog(
        'Not enough gold!', 
        'You do not have enough gold to purchase these items, please check and try again.'
      );
    } else {
      this.player.addGold(-heal.price);
      this.player.heal(heal.value);
    }
  }

}
