import { Component } from '@angular/core';
import { SheriffPlayer } from '../models/sheriff-player.interface';
import { SheriffCard } from '../models/sheriff-card.interface';

@Component({
  selector: 'sheriff-game',
  styleUrls: ['sheriff-game.component.scss'],
  template: `
    <div>Sheriff Game</div>
    <div *ngIf="!gameOver && !gameStarted">Select the number of players in the game</div>
    <div *ngIf="!gameOver && !gameStarted">
        <span>
            <button (click)="setupPlayers(2)">2</button>
            <button (click)="setupPlayers(3)">3</button>
            <button (click)="setupPlayers(4)">4</button>
        </span>
    </div>
    <div *ngIf="!gameOver && gameStarted">
        <h2>You are Player {{ user.id }}</h2>
        <h2>Turn {{ turn }}</h2>
        <h2>The current sheriff is Player {{ sheriff }}</h2>
        <span *ngIf="state === 'selecting'">
            <div (click)="setSelected(card)" 
                class="card"
                *ngFor="let card of user.hand" 
                [ngClass]="{'contraband': card.contraband, 'selected': card.selected}">
                <div>{{ card.type | uppercase }}</div>    
                <div>Value - {{ card.value }}</div> 
                <div>Penalty - {{ card.penalty }}</div> 
            </div>
            <button (click)="putInBag(user)">Put Selection In Bag</button>
        </span>
        <span *ngIf="state === 'bribing'">
            <pre>Bag contains: {{ this.user.bag | json }}</pre>
            <div class="declaration">
                <input type="number" name="declarationAmount" [ngModel]="user.bag.length" readonly>
                <select
                name="declaration"
                [ngModel]="user.declaration">
                    <option
                        *ngFor="let item of cardTypes"
                        [value]="item.key"
                        [selected]="item.key === user.declaration">
                        {{ item.value }}
                    </option>
                </select>
            </div>
            <div class="bribe">
                <input type="number" name="user.bribe" [ngModel]="user.bribe">
                <button (click)="addBribe(bribe, user)">Add bribe</button>
            </div>
        </span>
        <span *ngIf="state === 'checking'">
            <div *ngIf="sheriff === user.id">
                <div *ngFor="let player of players">
                    <div *ngIf="player.id !== user.id" (click)="playerBagSelected(player)" class="bag" [ngClass]="{'selected': player.bag === selectedBag, 'passed': player.bagPassed, 'checked': player.bagChecked}">    
                        Player {{ player.id }} declares {{ player.bag.length }} {{ player.declaration }} with 
                        <span *ngIf="player.bribe > 0">a bribe of {{ player.bribe }}</span>
                        <span *ngIf="player.bribe === 0">no bribe</span>
                    </div>
                    <div *ngIf="selectedBag === player.bag">
                        <button (click)="acceptBribe(player)">Accept Bribe/Let Bag Through</button>
                        <button (click)="checkBag(player)">Check Bag</button>
                    </div>
                </div>
            </div>
            <div *ngIf="sheriff !== user.id">
                Items being checked
                <button (click)="nextTurn()">Next Turn</button>
            </div>
        </span>
    </div>
    <div *ngIf="gameOver">
        <h1>Game Over</h1>
        <div>Scoreboard</div>
        <div (click)="setSelected(card)" 
            *ngFor="let player of players">
            Player {{ player.id }} Score - {{ player.score }}
        </div>
        <button (click)="restartGame()">Play Again</button>
    </div>
  `
})
//TODO styles, validation on inputs, all CPU actions
//TODO add market phase
//TODO make Uno game
export class SheriffGameComponent {
    players: SheriffPlayer[] = [];
    deck: SheriffCard[] = [];
    gameOver: boolean = false;
    gameStarted: boolean = false;
    turn: number = 1;
    handSize: number = 6;
    sheriff: number = 1;
    user: SheriffPlayer;
    state: string;
    cardTypes = [
        {key: 'apple', value: 'Apples'},
        {key: 'cheese', value: 'Cheese'},
        {key: 'bread', value: 'Bread'},
        {key: 'chicken', value: 'Chickens'}
    ];
    selectedBag: SheriffCard[];
    constructor() {}

    getRandomInt(low : number, high : number)
    : number{
        return Math.floor(Math.random() * (high - low + 1)) + low;
    }

    shuffle(arr: SheriffCard[]) {
        var i, j, temp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;    
    };

    setupPlayers(num: number){
        let userPlayerId = this.getRandomInt(1, num);
        let i = 1;
        while(i <= num){
            let player: SheriffPlayer = {
                id: i,
                isUser: i === userPlayerId,
                hand: [],
                bag: [],
                stored: [],
                bribe: 0,
                money: 50,
                score: 0,
                bagChecked: false,
                bagPassed: false,
                declaration: ''
            };
            this.players = [... this.players].concat([player]);
            i++;
        }
        this.createDeck();
        this.dealCards();

        this.user = this.players.find(p => p.isUser);
        this.gameStarted = true;
        this.state = "selecting";
        this.cpuActions();
        if(this.user.id === this.sheriff){
            this.state = "checking";
        }
    }

    createDeck(){
        //TODO implement royal cards
        for(let i = 1; i <= 204; i++){
            let cardType = this.getCardType(i);
            let card: SheriffCard = {
                type: cardType,
                contraband: i > 144,
                value: this.getCardValue(cardType),
                penalty: this.getCardPenalty(cardType),
                selected: false
            };
            this.deck = [... this.deck].concat([card]);
        }
        this.deck = this.shuffle(this.deck);
    }

    getCardType(index: number){
        if(index > 0 && index <= 48){
            return 'apple';
        }
        else if(index > 48 && index <= 84){
            return 'cheese';
        }
        else if(index > 84 && index <= 120){
            return 'bread';
        }
        else if(index > 120 && index <= 144){
            return 'chicken';
        }
        else if(index > 144 && index <= 166){
            return 'pepper';
        }
        else if(index > 166 && index <= 187){
            return 'mead';
        }
        else if(index > 187 && index <= 199){
            return 'silk';
        }
        else if(index > 199 && index <= 204){
            return 'crossbow';
        }
        else{
            return 'null-type';
        }
    }

    getCardValue(cardType: string){
        switch(cardType){
            case 'apple':
                return 2;
            case 'cheese':
                return 3;
            case 'bread':
                return 3;
            case 'chicken':
                return 4;
            case 'pepper':
                return 6;
            case 'mead':
                return 7;
            case 'silk':
                return 8;
            case 'crossbow':
                return 9;
            default:
                return 0;
        }
    }

    getCardPenalty(cardType: string){
        switch(cardType){
            case 'apple':
                return 2;
            case 'cheese':
                return 2;
            case 'bread':
                return 2;
            case 'chicken':
                return 2;
            case 'pepper':
                return 4;
            case 'mead':
                return 4;
            case 'silk':
                return 4;
            case 'crossbow':
                return 4;
            default:
                return 0;
        }
    }

    dealCards(){
        for(let i = 0; i < this.players.length; i++){
            while(this.players[i].hand.length < this.handSize){
                this.drawCard(this.players[i]);
            }
        }
    }

    drawCard(player: SheriffPlayer){
        let topCard = this.deck.shift();
        player.hand = [... player.hand].concat([topCard]);
    }

    setSelected(card: SheriffCard){
        card.selected = !card.selected;
    }

    putInBag(user: SheriffPlayer){
        user.bag = user.hand.filter(c => c.selected);
        user.hand = user.hand.filter(c => !c.selected);
        this.state = "bribing";
    }

    addBribe(bribeAmount: number, user: SheriffPlayer){
        user.bribe = bribeAmount;
        user.money = user.money - bribeAmount;
        this.state = "checking";
    }

    setSheriff(){
        this.sheriff++;
        if(this.sheriff > this.players.length){
            this.sheriff = 1;
            this.turn++;
            if(this.turn > 2){
                this.gameOver = true;
                //TODO implement king and queen bonus
                for(let i = 0; i < this.players.length; i++){
                    this.players[i].score = this.players[i].money;
                    for(let j = 0; j < this.players[i].stored.length; j++){
                        this.players[i].score += this.players[i].stored[j].value;
                    }
                }
            }
        }
    }

    payFines(fromPlayer: SheriffPlayer, toPlayer: SheriffPlayer){
        let totalPenalties = 0;
        let penaltyCards = fromPlayer.bag.filter(c => c.contraband || c.type !== fromPlayer.declaration );
        penaltyCards.forEach(c => totalPenalties += c.penalty);
        toPlayer.money += totalPenalties;
        fromPlayer.money -= totalPenalties;
    }

    finishInspection(){
        for(let i = 0; i < this.players.length; i++){
            if(this.sheriff !== i+1){
                if(this.players[i].bagChecked){
                    this.players[i].money += this.players[i].bribe;
                    this.payFines(this.players[i], this.players[this.sheriff]);

                    this.players[i].bag = this.players[i].bag.filter(c => !c.contraband && c.type === this.players[i].declaration );
                }
                this.players[i].stored = [...this.players[i].stored].concat(this.players[i].bag);
            } 
            this.players[i].bribe = 0;
            this.players[i].bag = [];
            this.players[i].bagPassed = false;
            this.players[i].bagChecked = false;
        }
    }

    cpuActions(){
        for(let i = 0; i < this.players.length; i++){
            if(this.sheriff !== i+1 && this.user.id !== i+1){
                var typeToUse = "";
                var aCount = 0;
                var bCount = 0;
                var cCount = 0;
                var dCount = 0;
                for (var x = 0; x < this.players[i].hand.length; x++) {
                    var type = this.players[i].hand[x].type;
                    if(type === 'apple'){
                        aCount++;
                    }else if(type === 'bread'){
                        bCount++;
                    }else if(type === 'cheese'){
                        cCount++;
                    }else if(type === 'chicken'){
                        dCount++;
                    }
                }
                let maxVal = Math.max(aCount, bCount, cCount, dCount);
                if(maxVal === aCount){
                    typeToUse = 'apple';
                }else if(maxVal === bCount){
                    typeToUse = 'bread';
                }else if(maxVal === cCount){
                    typeToUse = 'cheese';
                }else if(maxVal === dCount){
                    typeToUse = 'chicken';
                }
                this.players[i].declaration = typeToUse;
                this.players[i].bag = this.players[i].hand.filter(c => c.type === typeToUse);
                this.players[i].hand = this.players[i].hand.filter(c => c.type !== typeToUse);

                let contrabandProb = this.getRandomInt(1, 100);
                let contrabandNum = this.players[i].hand.filter(c => c.contraband).length;
                if(contrabandProb > 60){
                    let contrabandToUse = this.getRandomInt(1, contrabandNum);
                    let contrabandItems = this.players[i].hand.filter(c => c.contraband);
                    for(let x = 0; x < contrabandToUse; x++){
                        this.players[i].bag = [...this.players[i].bag].concat(contrabandItems.shift());
                        let removeContraband = true;
                        this.players[i].hand = this.players[i].hand.filter(c => {
                            if(c.contraband && removeContraband){
                                removeContraband = false;
                                return false;
                            }
                            return true;
                        });
                    }
                }

                var bribeAmount = 0;
                let bribeProb = this.getRandomInt(1, 100);
                if(bribeProb > 33){
                    bribeAmount = this.getRandomInt(1, 5);
                    this.players[i].bribe = bribeAmount;
                    this.players[i].money = this.players[i].money - bribeAmount;
                }
            }
        }
    }

    playerBagSelected(player: SheriffPlayer){
        if(!player.bagPassed && !player.bagChecked){
            this.selectedBag = player.bag;
        } else {
            this.selectedBag = null;
        }
    }

    acceptBribe(player: SheriffPlayer){
        player.bagPassed = true;
        this.user.money += player.bribe;
        player.bribe = 0;
        this.selectedBag = null;
        if(this.players.every(p => p.id === this.sheriff || p.bagPassed || p.bagChecked)){
           this.nextTurn();
        }
    }

    checkBag(player: SheriffPlayer){
        player.bagChecked = true;
        this.selectedBag = null;
        if(this.players.every(p => p.id === this.sheriff || p.bagPassed || p.bagChecked)){
            this.nextTurn();
         }
    }

    nextTurn(){
        this.finishInspection();
        this.dealCards();
        this.setSheriff();
        this.state = "selecting";
        this.cpuActions();
        if(this.user.id === this.sheriff){
            this.state = "checking";
        }
    }

    restartGame(){
        window.location.reload();
    }
}
