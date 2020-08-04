import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.scss'],
  template: `
    <a routerLink="/roll">Roll Game</a>
    <a routerLink="/sheriff">Sheriff Game</a>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor() {}
}
