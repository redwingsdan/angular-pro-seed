import { NgModule } from '@angular/core';
import { RollGameComponent } from './roll-game.component';
import { CardModule } from '../card/card.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, CardModule],
  declarations: [
    RollGameComponent
  ],
  exports: [
    RollGameComponent
  ]
})
export class RollGameModule {}