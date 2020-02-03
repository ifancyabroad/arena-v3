import { Component, OnInit, ViewChild } from '@angular/core';
import { Player } from 'src/app/shared/classes/player';
import { PlayerService } from 'src/app/shared/services/player.service';
import { ItemsService } from 'src/app/shared/services/items.service';
import { Item } from 'src/app/shared/interfaces/item';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  player: Player;

  columnsToDisplay = ['name', 'effect', 'type', 'price', 'select'];
  dataSource: MatTableDataSource<Item>;
  selection = new SelectionModel<Item>(true, []);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private playerService: PlayerService,
    private itemService: ItemsService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.player = this.playerService.player;
    this.itemService.getItems().subscribe(items => {
      this.dataSource = new MatTableDataSource(items);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  // Check the player has enough gold
  checkGold(items: Item[]) {
    let goldTotal = 0;
    items.forEach(item => goldTotal += item.price);
    return this.player.gold >= goldTotal;
  }

  // Check if player meets the requirements
  checkRequirements(items: Item[]) {
    let requirementsMet = true;
    items.forEach(item => {
      for (let req of Object.keys(item.requirements)) {
        if (item.requirements[req] > this.player.stats[req].base) {
          requirementsMet = false;
        }
      }  
    });
    return requirementsMet;
  }

  // Purchase selected item
  buyItem(items: Item[]) {
    if (!this.checkGold(items)) {
      this.modalService.openDialog(
        'Not enough gold!', 
        'You do not have enough gold to purchase these items, please check and try again.'
      );
    } else if (!this.checkRequirements(items)) {
      this.modalService.openDialog(
        'Requirements not met!', 
        'You do not meet the stat requirements for 1 or more of the items selected, please check and try again.'
      );
    } else {
      items.forEach(item => this.player.buyItem(item));
      this.selection.clear();
    }
  }

  // The label for the checkbox on the passed row
  checkboxLabel(row: Item): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} ${row.name}`;
  }
}
