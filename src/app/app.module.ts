import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/Card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { CharacterCreateComponent } from './game/character-create/character-create.component';
import { HomeComponent } from './game/home/home.component';
import { GameComponent } from './game/game.component';
import { TownComponent } from './game/town/town.component';
import { HttpClientModule } from '@angular/common/http';
import { PlayerComponent } from './game/town/player/player.component';
import { HealerComponent } from './game/town/healer/healer.component';
import { StoreComponent } from './game/town/store/store.component';
import { TrainerComponent } from './game/town/trainer/trainer.component';
import { TavernComponent } from './game/town/tavern/tavern.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    CharacterCreateComponent,
    HomeComponent,
    GameComponent,
    TownComponent,
    PlayerComponent,
    HealerComponent,
    StoreComponent,
    TrainerComponent,
    TavernComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
