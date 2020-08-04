import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SheriffGameComponent } from './sheriff-game.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    SheriffGameComponent
  ],
  exports: [
    SheriffGameComponent
  ]
})
export class SheriffGameModule {}