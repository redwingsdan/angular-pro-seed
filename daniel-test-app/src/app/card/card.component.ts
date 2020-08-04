import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../models/card.interface';

@Component({
  selector: 'card',
  styleUrls: ['card.component.scss'],
  template: `
    <div class="card-background" [ngClass]="{'selected': selectedClass}" (click)="clickCard()">{{ selectedCard.name }}</div>
  `
})
export class CardComponent {
  @Input() selectedCard: Card;
  @Input() selectedClass: boolean;
  @Output() clickedCard: EventEmitter<Card> = new EventEmitter<Card>();
  constructor() {}

  clickCard(){
    this.clickedCard.emit(this.selectedCard);
  }
}
