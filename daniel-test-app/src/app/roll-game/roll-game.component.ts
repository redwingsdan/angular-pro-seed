import { Component } from '@angular/core';
import { Card } from 'src/app/models/card.interface';
import { Character } from 'src/app/models/character.interface';
import { Stat } from 'src/app/models/character.interface';
import { Enemy } from 'src/app/models/enemy.interface';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'roll-game',
  styleUrls: ['roll-game.component.scss'],
  template: `
  <div *ngIf="gameOver">
    <h1>Game Over</h1>
    <h2>You lost at level {{ level }}</h2>
    <button (click)="restartGame()">Play Again</button>
  </div>

  <div *ngIf="winFlg">
    <h1>You Win!</h1>
    <button (click)="restartGame()">Play Again</button>
  </div>

  <div class="info-wrapper">

    <div *ngIf="!gameOver && !winFlg" class="game-wrapper">
      <h1>Level {{ level }}</h1>
      <div *ngIf="state === 'roll' || state === 'spin'" class="enemies">Enemies are attacking: 
        <div *ngFor="let enemy of enemies; let i = index">
          Enemy {{ (i + 1) }} - Health: {{ enemy.health }}, Damage: {{ enemy.damage }}, Defense: {{ enemy.defense }}
        </div>
      </div>
      <div class="player-info">
        <button (click)="rollDice()" [disabled]="state !== 'roll'">Roll the dice</button>
        <div *ngIf="state !== 'roll'">You rolled a 
          <span *ngFor="let roll of rolls; let i = index"><span *ngIf="i != 0"> and a </span>{{ roll }}</span>
        </div>

        <div *ngIf="state === 'card'" class="cards-container">
          <card *ngFor="let rolledCard of rolledCards" [selectedCard]="rolledCard" [selectedClass]="chosenCardId === ('r' + rolledCard.roll)" (clickedCard)="cardClicked($event, 'r')"></card>
        </div>
        <div *ngIf="state !== 'roll'">
          <div *ngIf="state === 'spin'" class="changing-spinner">{{ spinnerValue }}</div>
          <button (click)="spinWheel()" [disabled]="state !== 'spin'">Spin the Wheel</button>
          <div *ngIf="state === 'card'">Spin
            <card [selectedCard]="bonusCard" [selectedClass]="chosenCardId === ('s' + bonusCard.roll)" (clickedCard)="cardClicked($event, 's')"></card>
          </div>
        </div>

        <div *ngIf="state === 'card' && chosenCard">
          <button (click)="selectedCard()">Select Card</button>
        </div>

      </div>

    </div>

    <div class="character-stats">Character Stats
      <div *ngFor="let stat of character.stats">
        <span class="stat-name">{{ stat.name | uppercase }}</span>
        - 
        <span class="stat-value">{{ stat.value }}</span>
        <span class="potential-change" *ngIf="chosenCard?.stat === stat.name && state === 'card' && chosenCard.change !== 0">
          <span [ngClass]="{'positive' : chosenCard.change > 0, 'negative' : chosenCard.change < 0}">{{ chosenCard.change }}</span>
        </span>
        <span class="potential-new-value" *ngIf="chosenCard?.stat === stat.name && state === 'card' && chosenCard.change !== 0">({{ stat.value + chosenCard.change }})</span>
      </div>
    </div>

  </div>
  `
})
//TODO: Add more stats and more cards
export class RollGameComponent {
  rolls: number[] = [];
  state: string = 'roll';
  rolledCards: Card[] = [];
  bonusCard?: Card;
  character: Character = {
    stats: [
      {name: 'health', value: 10},
      {name: 'damage', value: 1},
      {name: 'defense', value: 1},
      {name: 'rolls', value: 1}
    ]
  };
  cards: Card[] = [
    {name: '+2 Health', roll: 1, change: 2, stat: 'health'},
    {name: '+1 Damage', roll: 2, change: 1, stat: 'damage'},
    {name: '+2 Damage', roll: 3, change: 1, stat: 'damage'},
    {name: '+1 Roll', roll: 4, change: 1, stat: 'rolls'},
    {name: '+3 Damage', roll: 5, change: 3, stat: 'damage'},
    {name: '+2 Defense', roll: 6, change: 2, stat: 'defense'},
    {name: '+3 Defense', roll: 7, change: 3, stat: 'defense'},
    {name: '+2 Roll', roll: 8, change: 2, stat: 'rolls'},
    {name: '+2 Damage', roll: 9, change: 2, stat: 'damage'},
    {name: '+3 Health', roll: 10, change: 3, stat: 'health'},
    {name: '+3 Damage', roll: 11, change: 3, stat: 'damage'},
    {name: '+5 Health', roll: 12, change: 5, stat: 'health'},
    {name: '+1 Defense', roll: 13, change: 1, stat: 'defense'},
    {name: '+2 Defense', roll: 14, change: 2, stat: 'defense'},
    {name: '+3 Defense', roll: 15, change: 3, stat: 'defense'}
  ];
  enemies: Enemy[] = [
    {health: 1, damage: 1, defense: 1}
  ];
  level: number = 1;
  gameOver: boolean = false;
  winFlg: boolean = false;
  spinnerValue: number = 1;
  spinnerChange: Subscription;
  chosenCard: Card;
  potentialChange: number;
  chosenCardId: string;

  constructor() {}

  rollDice(){
    this.state = 'spin';
    this.spinnerChange = Observable.interval(50).subscribe((val) => {
      this.spinnerValue++;
      if(this.spinnerValue > 15){
        this.spinnerValue = 1;
      }
    });
    let rollSum: number = 0;
    let characterRolls: Stat = this.character.stats.find((stat: Stat) => stat.name === 'rolls');
    for(let i = 0; i < characterRolls.value; i++){
      this.rolls[i] = this.getRandomInt(1, 3);
      this.rolledCards[i] = this.cards.find((card: Card) => card.roll === (rollSum + this.rolls[i]));
      rollSum += this.rolls[i];
    }
  }

  spinWheel(){
    this.spinnerChange.unsubscribe();
    this.state = 'card';
    let bonusRoll: number = this.spinnerValue;
    this.bonusCard = this.cards.find((card: Card) => card.roll === bonusRoll);
  }

  getRandomInt(low : number, high : number)
  : number{
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }
  cardClicked(selectedCard: Card, cardType: string){
    this.chosenCard = selectedCard;
    this.chosenCardId = cardType + selectedCard.roll;
  }

  selectedCard(){
    console.log(this.chosenCard);
    let characterStat: Stat = this.character.stats.find((stat: Stat) => stat.name === this.chosenCard.stat);
    characterStat.value += this.chosenCard.change;
    this.validateStats();
    this.fight();
    let health: Stat = this.character.stats.find((stat: Stat) => stat.name === 'health');
    if(health.value <= 0){
      this.gameOver = true;
    }else{
      this.state = 'roll';
      this.level++;
      this.populateEnemies();
    }
    if(this.level > 50){
      this.winFlg = true;
    }
    this.chosenCard = null;
    this.chosenCardId = null;
  }

  fight(){
    let health: Stat = this.character.stats.find((stat: Stat) => stat.name === 'health');
    let originalDefense: Stat = {name: 'defense', value: this.character.stats.find((stat: Stat) => stat.name === 'defense').value};
    for(let i = 0; i < this.enemies.length; i++){
      let enemy: Enemy = this.enemies[i];
      while(enemy.health > 0 && health.value > 0){
        this.attack(enemy);
        if(enemy.health > 0){
          this.defend(enemy);
        }
      }
      //Restore defense to original value for next enemy
      this.character.stats.find((stat: Stat) => stat.name === 'defense').value = originalDefense.value;
    }
  }

  attack(enemy: Enemy){
    let damage: Stat = this.character.stats.find((stat: Stat) => stat.name === 'damage');
    let difference = damage.value - enemy.defense;
    if(difference > 0){
      enemy.health -= difference;
      console.log('Enemy health dropped to ', enemy.health);
    } else {
      enemy.defense--;
      console.log('Enemy defense dropped to ', enemy.defense);
    }
  }

  defend(enemy: Enemy){
    let health: Stat = this.character.stats.find((stat: Stat) => stat.name === 'health');
    let defense: Stat = this.character.stats.find((stat: Stat) => stat.name === 'defense');
    let difference = enemy.damage - defense.value;
    if(difference > 0){
      health.value -= difference;
      console.log('Character health dropped to ', health.value);
    } else {
      defense.value--;
      console.log('Character defense dropped to ', defense.value);
    }
  }

  populateEnemies(){
    this.enemies = [];
    for(let i = 0; i < this.level; i++){
      //TODO: Add boss enemy
      let health: number = this.getRandomInt(Math.floor(this.level / 2), this.level - 1);
      let damage: number = this.getRandomInt(Math.floor(this.level / 2), this.level - 1);
      let defense: number = this.getRandomInt(Math.floor(this.level / 2), this.level - 1);
      let enemy: Enemy = {health: health, damage: damage, defense: defense};
      this.enemies.push(enemy);
    }
  }

  validateStats(){
    this.character.stats.forEach((stat: Stat) => {
      if(stat.name === 'health'){
        if(stat.value < 0){
          stat.value = 0;
        }
      } else if(stat.name === 'damage'){
        if(stat.value < 0){
          stat.value = 0;
        }
      } else if(stat.name === 'rolls'){
        if(stat.value > 5){
          stat.value = 5;
        }
        if(stat.value < 1){
          stat.value = 1;
        }
      }
    });
  }

  restartGame(){
    window.location.reload();
  }
}
