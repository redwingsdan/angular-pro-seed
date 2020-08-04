import { Routes } from '@angular/router';
import { RollGameComponent } from './roll-game/roll-game.component';
import { SheriffGameComponent } from './sheriff-game/sheriff-game.component';

// routes
export const AppRoutes: Routes = [
    { path: '', redirectTo: '/roll', pathMatch: 'full' },
    { path: 'roll', component: RollGameComponent },
    { path: 'sheriff', component: SheriffGameComponent }
];