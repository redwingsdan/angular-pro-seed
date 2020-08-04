import { SheriffCard } from './sheriff-card.interface';

export interface SheriffPlayer{
    id: number;
    isUser: boolean;
    hand: SheriffCard[];
    bag: SheriffCard[];
    stored: SheriffCard[];
    bribe: number;
    money: number;
    score: number;
    bagChecked: boolean;
    bagPassed: boolean;
    declaration: string;
}